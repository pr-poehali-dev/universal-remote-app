"""API для управления настройками приложения"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Управление настройками приложения"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    try:
        if method == 'GET':
            return get_settings()
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            return update_settings(body)
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

def get_settings():
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT setting_key, setting_value, updated_at
                FROM t_p77920312_universal_remote_app.app_settings
                ORDER BY setting_key
            """)
            rows = cur.fetchall()
            
            settings = {}
            for row in rows:
                settings[row['setting_key']] = row['setting_value']
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(settings)
            }
    finally:
        conn.close()

def update_settings(data):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            for key, value in data.items():
                cur.execute("""
                    INSERT INTO t_p77920312_universal_remote_app.app_settings 
                    (setting_key, setting_value, updated_at)
                    VALUES (%s, %s, CURRENT_TIMESTAMP)
                    ON CONFLICT (setting_key) 
                    DO UPDATE SET setting_value = %s, updated_at = CURRENT_TIMESTAMP
                """, (key, str(value), str(value)))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Settings updated successfully'})
            }
    finally:
        conn.close()
