include ../build/Makefiles/toolchain.mk

.PHONY: lint
lint:
	$(ESLINT) --report-unused-disable-directives gateway
# TODO: lint site/

test:
	@echo "No tests yet"
