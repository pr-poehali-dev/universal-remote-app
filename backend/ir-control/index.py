import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для управления ИК-устройствами и отправки команд'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        params = event.get('queryStringParameters', {}) or {}
        action = params.get('action', '')
        
        if method == 'GET' and action == 'devices':
            cur.execute('''
                SELECT id, name, model, type, brand, status, ir_codes, created_at 
                FROM devices 
                ORDER BY created_at DESC
            ''')
            devices = []
            for row in cur.fetchall():
                devices.append({
                    'id': row[0],
                    'name': row[1],
                    'model': row[2],
                    'type': row[3],
                    'brand': row[4],
                    'status': row[5],
                    'ir_codes': row[6],
                    'created_at': row[7].isoformat() if row[7] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'devices': devices}),
                'isBase64Encoded': False
            }
        
        if method == 'POST' and action == 'command':
            body = json.loads(event.get('body', '{}'))
            device_id = body.get('device_id')
            command = body.get('command')
            
            cur.execute('SELECT name, ir_codes FROM devices WHERE id = %s', (device_id,))
            device = cur.fetchone()
            
            if not device:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Device not found'}),
                    'isBase64Encoded': False
                }
            
            ir_codes = device[1]
            ir_code = ir_codes.get(command) if ir_codes else None
            
            if not ir_code:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Command not supported'}),
                    'isBase64Encoded': False
                }
            
            success = True
            
            cur.execute('''
                INSERT INTO command_history (device_id, command, success) 
                VALUES (%s, %s, %s)
            ''', (device_id, command, success))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'ir_code': ir_code,
                    'message': f'Command {command} sent successfully'
                }),
                'isBase64Encoded': False
            }
        
        if method == 'GET' and action == 'history':
            cur.execute('''
                SELECT h.id, h.command, h.success, h.created_at, d.name, d.type
                FROM command_history h
                JOIN devices d ON h.device_id = d.id
                ORDER BY h.created_at DESC
                LIMIT 50
            ''')
            history = []
            for row in cur.fetchall():
                history.append({
                    'id': row[0],
                    'command': row[1],
                    'success': row[2],
                    'created_at': row[3].isoformat() if row[3] else None,
                    'device_name': row[4],
                    'device_type': row[5]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'history': history}),
                'isBase64Encoded': False
            }
        
        if method == 'GET' and action == 'groups':
            cur.execute('''
                SELECT g.id, g.name, g.icon, 
                       json_agg(json_build_object('id', d.id, 'name', d.name, 'type', d.type)) as devices
                FROM device_groups g
                LEFT JOIN group_devices gd ON g.id = gd.group_id
                LEFT JOIN devices d ON gd.device_id = d.id
                GROUP BY g.id, g.name, g.icon
            ''')
            groups = []
            for row in cur.fetchall():
                groups.append({
                    'id': row[0],
                    'name': row[1],
                    'icon': row[2],
                    'devices': row[3] if row[3] else []
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'groups': groups}),
                'isBase64Encoded': False
            }
        
        if method == 'POST' and action == 'add_device':
            body = json.loads(event.get('body', '{}'))
            name = body.get('name')
            model = body.get('model')
            device_type = body.get('type')
            brand = body.get('brand')
            
            cur.execute('''
                INSERT INTO devices (name, model, type, brand, status) 
                VALUES (%s, %s, %s, %s, %s) 
                RETURNING id
            ''', (name, model, device_type, brand, 'online'))
            device_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': device_id, 'message': 'Device added successfully'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Endpoint not found'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()