import psycopg2


def main():
    conn = psycopg2.connect('postgres://avnadmin:AVNS_PYekk63YoqYqCl70zTW@himanshu-22500-himanshu22500-d8f2.l.aivencloud.com:10817/defaultdb?sslmode=require')

    query_sql = 'SELECT VERSION()'

    cur = conn.cursor()
    cur.execute(query_sql)

    version = cur.fetchone()[0]
    print(version)


if __name__ == "__main__":
    main()
