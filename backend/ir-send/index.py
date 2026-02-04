"""API для отправки ИК-команд на устройства"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import requests
from datetime import datetime

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Отправляет ИК-команду на устройство через HTTP API"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Only POST method allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        device_id = body.get('device_id')
        command = body.get('command')
        
        if not device_id or not command:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'device_id and command are required'})
            }
        
        conn = get_db_connection()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT id, name, model, brand, ir_codes, status
                    FROM t_p77920312_universal_remote_app.devices
                    WHERE id = %s
                """, (device_id,))
                device = cur.fetchone()
                
                if not device:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Device not found'})
                    }
                
                ir_codes = device.get('ir_codes', {})
                if not ir_codes or command not in ir_codes:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': f'Command {command} not found for device'})
                    }
                
                ir_code = ir_codes[command]
                
                cur.execute("""
                    SELECT setting_value 
                    FROM t_p77920312_universal_remote_app.app_settings
                    WHERE setting_key = 'ir_endpoint'
                """)
                endpoint_row = cur.fetchone()
                ir_endpoint = endpoint_row['setting_value'] if endpoint_row else None
                
                result = send_ir_command(ir_endpoint, ir_code, device['name'])
                
                cur.execute("""
                    INSERT INTO t_p77920312_universal_remote_app.command_history
                    (device_id, command_name, executed_at)
                    VALUES (%s, %s, CURRENT_TIMESTAMP)
                """, (device_id, command))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': result['success'],
                        'message': result['message'],
                        'device': device['name'],
                        'command': command,
                        'ir_code': ir_code
                    })
                }
        finally:
            conn.close()
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

def send_ir_command(endpoint, ir_code, device_name):
    """Отправляет ИК-команду через HTTP API"""
    if not endpoint:
        return {
            'success': False,
            'message': 'IR endpoint not configured in settings'
        }
    
    try:
        response = requests.post(
            endpoint,
            json={'code': ir_code, 'device': device_name},
            timeout=5
        )
        
        if response.status_code == 200:
            return {
                'success': True,
                'message': 'IR command sent successfully'
            }
        else:
            return {
                'success': False,
                'message': f'IR device returned status {response.status_code}'
            }
    except requests.exceptions.Timeout:
        return {
            'success': False,
            'message': 'Timeout connecting to IR device'
        }
    except requests.exceptions.ConnectionError:
        return {
            'success': False,
            'message': 'Could not connect to IR device'
        }
    except Exception as e:
        return {
            'success': False,
            'message': f'Error sending IR command: {str(e)}'
        }