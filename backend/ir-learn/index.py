import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для обучения пульта - запись ИК-кодов с реального пульта'''
    
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
    
    if method == 'POST':
        body = json.loads(event.get('body', '{}'))
        device_id = body.get('device_id')
        button = body.get('button')
        ir_code = body.get('ir_code')
        
        if not all([device_id, button, ir_code]):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing required fields: device_id, button, ir_code'})
            }
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        # Получаем текущие коды устройства
        cur.execute('SELECT ir_codes FROM devices WHERE id = %s', (device_id,))
        result = cur.fetchone()
        
        if not result:
            cur.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Device not found'})
            }
        
        ir_codes = result[0] or {}
        ir_codes[button] = ir_code
        
        # Обновляем коды
        cur.execute(
            'UPDATE devices SET ir_codes = %s, updated_at = %s WHERE id = %s',
            (json.dumps(ir_codes), datetime.utcnow().isoformat(), device_id)
        )
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'message': f'IR code for {button} saved successfully',
                'button': button,
                'ir_code': ir_code
            })
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
