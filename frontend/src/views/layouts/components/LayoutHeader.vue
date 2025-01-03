<template>
  <div class="border-b">
    <div class="container">
      <div class="flex items-center">
        <!-- Logo -->
        <div class="mr-3">
          <ShadcnLink link="/" class="pr-6 mt-1">
            <ShadcnAvatar src="/static/images/logo.svg" class="bg-white" alt="BadgeHub"/>
          </ShadcnLink>
        </div>

        <ShadcnMenu direction="horizontal">
          <ShadcnMenuSub name="徽章">
            <template #title>
              <div class="flex items-center space-x-2">
                <ShadcnIcon icon="Badge" size="18"/>
                <div>徽章</div>
              </div>
            </template>

            <ShadcnMenuItem name="Badge"
                            :active="$route.path === '/badge/static'"
                            to="/badge/static">
              <div class="flex items-center space-x-2">
                <ShadcnIcon icon="Badge" size="18"/>
                <div>静态徽章</div>
              </div>
            </ShadcnMenuItem>

            <ShadcnMenuItem name="GitHub"
                            :active="$route.path === '/badge/github'"
                            to="/badge/github">
              <div class="flex items-center space-x-2">
                <ShadcnIcon icon="Github" size="18"/>
                <div>GitHub 徽章</div>
              </div>
            </ShadcnMenuItem>
          </ShadcnMenuSub>
        </ShadcnMenu>
      </div>
    </div>
  </div>
</template>