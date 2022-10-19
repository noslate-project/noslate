BASE_URL=ghcr.io/noslate-project
PROJECT_ROOT=../..
NOSLATE_VERSION=
NOSLATE_URL=
DOCKER_BUILD_ARGS=
BUILD_ID=trunk

include $(PROJECT_ROOT)/build/Makefiles/platform.mk

build/noslate.tar.gz:
	mkdir -p build
	if [ ! -z "$(NOSLATE_URL)" ]; then \
		curl -sLo $@ $(NOSLATE_URL); \
	else \
		cp $(PROJECT_ROOT)/out/archives/noslate-$(PLATFORM)-$(UNAME_M)-$(BUILD_ID).tar.gz $@; \
	fi

noslate: build/noslate.tar.gz
	docker build \
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

.PHONY: clean
clean:
	rm -r build
