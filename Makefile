DENO = deno
DENO_PERMISSIONS = --allow-read \
                   --allow-env
DENO_FLAGS = $(DENO_PERMISSIONS)

fmt:
	$(DENO) fmt

test: 
	$(DENO) test $(DENO_FLAGS)

.PHONY: test fnm