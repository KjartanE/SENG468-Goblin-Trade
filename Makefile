#!make

# ------------------------------------------------------------------------------
# Makefile -- Seng 468
# ------------------------------------------------------------------------------

web: | close build-web run-web

build-web: ## Builds all backend+web containers
	@echo "==============================================="
	@echo "Make: build-web - building web images"
	@echo "==============================================="
	@docker-compose -f docker-compose.yml build frontend backend database

run-web: ## Runs all backend+web containers
	@echo "==============================================="
	@echo "Make: run-web - running web images"
	@echo "==============================================="
	@docker-compose -f docker-compose.yml up -d frontend backend database

log-frontend: ## Runs `docker logs <container> -f` for the frontend container
	@echo "==============================================="
	@echo "Running docker logs for the frontend container"
	@echo "==============================================="
	@docker logs frontend -f

log-backend: ## Runs `docker logs <container> -f` for the backend container
	@echo "==============================================="
	@echo "Running docker logs for the backend container"
	@echo "==============================================="
	@docker logs backend -f
	
log-db: ## Runs `docker logs <container> -f` for the db container
	@echo "==============================================="
	@echo "Running docker logs for the db container"
	@echo "==============================================="
	@docker logs database -f

close: ## Closes all project containers
	@echo "==============================================="
	@echo "Make: close - closing Docker containers"
	@echo "==============================================="
	@docker-compose -f docker-compose.yml down

clean: ## Closes and cleans (removes) all project containers
	@echo "==============================================="
	@echo "Make: clean - closing and cleaning Docker containers"
	@echo "==============================================="
	@docker-compose -f docker-compose.yml down -v --rmi all --remove-orphans

install: ## Runs `npm install` for all projects
	@echo "==============================================="
	@echo "Running /backend install"
	@echo "==============================================="
	@cd backend && npm install && cd ..
	@echo "==============================================="
	@echo "Running /frontend install"
	@echo "==============================================="
	@cd frontend && npm install && cd ..
	@echo "==============================================="
