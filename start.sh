#!/bin/sh

UID=$(id -u) GID=$(id -g) docker-compose run --rm -p 8080:3000 app