FROM mysql/mysql-server:latest

# Copy the SQL dump into the entrypoint directory
COPY database_dump.sql /docker-entrypoint-initdb.d/

# Ensure proper permissions
RUN chmod 644 /docker-entrypoint-initdb.d/database_dump.sql
