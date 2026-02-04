"""API для управления устройствами"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    try:
        if method == 'GET':
            return get_devices()
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            return create_device(body)
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            device_id = body.get('id')
            return update_device(device_id, body)
        elif method == 'DELETE':
            query_params = event.get('queryStringParameters', {})
            device_id = query_params.get('id')
            return delete_device(device_id)
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

def get_devices():
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT id, name, model, type, brand, ir_codes, status, 
                       created_at, updated_at
                FROM t_p77920312_universal_remote_app.devices
                ORDER BY created_at DESC
            """)
            devices = cur.fetchall()
            
            for device in devices:
                if device['created_at']:
                    device['created_at'] = device['created_at'].isoformat()
                if device['updated_at']:
                    device['updated_at'] = device['updated_at'].isoformat()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(devices)
            }
    finally:
        conn.close()

def create_device(data):
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                INSERT INTO t_p77920312_universal_remote_app.devices 
                (name, model, type, brand, ir_codes, status)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id, name, model, type, brand, ir_codes, status, created_at, updated_at
            """, (
                data.get('name'),
                data.get('model', ''),
                data.get('type', 'tv'),
                data.get('brand', ''),
                json.dumps(data.get('ir_codes', {})),
                data.get('status', 'offline')
            ))
            device = cur.fetchone()
            conn.commit()
            
            if device['created_at']:
                device['created_at'] = device['created_at'].isoformat()
            if device['updated_at']:
                device['updated_at'] = device['updated_at'].isoformat()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(device)
            }
    finally:
        conn.close()

def update_device(device_id, data):
    if not device_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Device ID is required'})
        }
    
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                UPDATE t_p77920312_universal_remote_app.devices
                SET name = %s, model = %s, type = %s, brand = %s, 
                    ir_codes = %s, status = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id, name, model, type, brand, ir_codes, status, created_at, updated_at
            """, (
                data.get('name'),
                data.get('model', ''),
                data.get('type', 'tv'),
                data.get('brand', ''),
                json.dumps(data.get('ir_codes', {})),
                data.get('status', 'offline'),
                device_id
            ))
            device = cur.fetchone()
            conn.commit()
            
            if not device:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Device not found'})
                }
            
            if device['created_at']:
                device['created_at'] = device['created_at'].isoformat()
            if device['updated_at']:
                device['updated_at'] = device['updated_at'].isoformat()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(device)
            }
    finally:
        conn.close()

def delete_device(device_id):
    if not device_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Device ID is required'})
        }
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                DELETE FROM t_p77920312_universal_remote_app.devices
                WHERE id = %s
            """, (device_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Device deleted successfully'})
            }
    finally:
        conn.close()
