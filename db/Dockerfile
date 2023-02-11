# Use the official PostgreSQL image as the base image
FROM postgres:12.3

# Set the environment variable for the default user and database
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=password
ENV POSTGRES_DB: db

COPY home_library_db.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
