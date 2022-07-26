DENO = deno
DENO_PERMISSIONS = --allow-read \
                   --allow-env
DENO_FLAGS = $(DENO_PERMISSIONS)

check: check/fmt check/lint

check/fmt: 
	$(DENO) fmt --check
check/lint:
	$(DENO) lint
fmt:
	$(DENO) fmt
test: 
	$(DENO) test $(DENO_FLAGS)

.PHONY: test fmt check check/lint check/fmt