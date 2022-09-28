BASE_URL=ghcr.io/noslate-project
NOSLATE_VERSION=
NOSLATE_URL=
DOCKER_BUILD_ARGS=

noslate:
	docker build \
		--build-arg NOSLATE_URL=$(NOSLATE_URL) \
		-f noslate.dockerfile \
		-t $(BASE_URL)/noslate:$(NOSLATE_VERSION) \
		$(DOCKER_BUILD_ARGS) .

noslate-gateway:
	cd ../gateway && npm i
	cd ../ && docker build --no-cache \
		--build-arg BASE_IMG=$(BASE_URL)/noslate:$(NOSLATE_VERSION) \
		-f ./distro/noslate-gateway.dockerfile \
		-t $(BASE_URL)/noslate-gateway:$(NOSLATE_VERSION) \
		$(DOCKER_BUILD_ARGS) .
