#!/usr/bin/env bash
root_project = ..

platform := biohazard
project := ${platform}-frontend
releaseBucket := ${platform}-release
build = build
target = target

BG =\n\033[0;36m-- # Beginning
NC =\033[0m\n# No Color

$(shell git config --global --add safe.directory '*')

version := $(shell git describe --tags --match="v*")

.PHONY: all
all: clean qa

.PHONY: npm
npm:
	@(printf "${BG}Installing NPM dependencies${NC}")
		cd $(root_project) && npm install --ci --no-audit

.PHONY: app
app: npm
	@(printf "${BG}Running Gulp tasks${NC}")
		cd $(root_project) && npm run start -- build --appVersion=$(version) --color

	@(printf "${BG}Generate Storybook${NC}")
		cd $(root_project) && npm run storybook-build

	@(printf "${BG}Preparing build directory${NC}")
		mkdir -p $(build)
		mkdir -p $(target)

	@(printf "${BG}Generating version file${NC}")
		mkdir -p $(build)
		echo "VERSION=$(version)" >$(build)/version.txt
		echo "BUILD_DATE=$(shell date --utc +%FT%TZ)" >> $(build)/version.txt
		echo "BUILD_TAG=$(shell echo $$BUILD_TAG)" >> $(build)/version.txt

	@(printf "${BG}Copying app to build directory${NC}")
		cp -r $(root_project)/www/* $(build)/

.PHONY: package
package: app
	@(printf "${BG}Create package${NC}")
		chmod 777 target
		cd $(root_project) && npm run start -- package --appVersion=$(version) --color

	@(printf "${BG}Package version $(version) is ready${NC}")
		echo $(version) >target/latest.version

.PHONY: qa # Quality Assurance
qa:
	@(printf "${BG}Prepare log directory${NC}")
		mkdir -p $(root_project)/log
		chmod -R 777 $(root_project)/log

	@(printf "${BG}Running tests${NC}")
		cd $(root_project) && export FORCE_COLOR=1 && npm test || true

.PHONY: clean
clean:
	@(printf "${BG}Cleaning project${NC}")
		rm -rf $(build)
		rm -rf $(target)

.PHONY: release
release:
	@(printf "${BG}Upload package to S3 repository${NC}")
		aws s3 cp target/latest.version "s3://$(releaseBucket)/dev/$(project).version";
		aws s3 cp target/frontend.zip "s3://$(releaseBucket)/dev/$(project).zip";
		aws s3 cp target/frontend.zip "s3://$(releaseBucket)/dev/$(project)-$(version).zip";

		if [ `echo ${version} | egrep "^v[0-9]+(+\.[0-9]+){2}$$"` ]; then \
			aws s3 cp target/latest.version "s3://$(releaseBucket)/stable/$(project).version"; \
			aws s3 cp target/frontend.zip "s3://$(releaseBucket)/stable/$(project).zip"; \
			aws s3 cp target/frontend.zip "s3://$(releaseBucket)/stable/$(project)-$(version).zip"; \
		fi

