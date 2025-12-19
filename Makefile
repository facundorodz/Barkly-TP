.PHONY: start-db stop-db querys start-backend run-backend

start-db:
	sudo docker compose up -d

stop-db:
	sudo docker compose down

querys:
	@echo "Si falló, es que no está levantada la BD. Hacer 'make start-db'"
	@echo "--------------------------------------------------------------"
	sudo docker exec -it barkly-postgres psql -U postgres -d barkly

start-backend:
	npm start

run-backend: start-db start-backend