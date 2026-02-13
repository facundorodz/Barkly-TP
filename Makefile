.PHONY: querys start-db stop-db start-backend stop-backend start-frontend stop-frontend start-all stop-all 

querys:
	@echo "--------------------------------------------------------------"
	@echo "Si falló, es que no está levantada la BD. Hacer 'make start-db'"
	@echo "--------------------------------------------------------------"
	sudo docker exec -it barkly-postgres psql -U postgres -d barkly

start-all:
	sudo docker compose up -d --build

stop-all:
	sudo docker compose stop

start-postgres:
	sudo docker compose up -d postgres

stop-postgres:
	sudo docker compose stop postgres

start-backend:
	sudo docker compose up -d backend

stop-backend:
	sudo docker compose stop backend

start-frontend:
	sudo docker compose up -d frontend

stop-frontend:
	sudo docker compose stop frontend