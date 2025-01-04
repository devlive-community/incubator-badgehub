<template>
  <ShadcnLayout class="min-h-screen">
    <ShadcnLayoutWrapper>
      <ShadcnLayoutMain>
        <ShadcnLayoutHeader class="sticky top-0 bg-white z-10">
          <LayoutHeader/>
        </ShadcnLayoutHeader>

        <ShadcnLayoutContent class="container py-4 min-h-screen">
          <RouterView/>
        </ShadcnLayoutContent>
      </ShadcnLayoutMain>
    </ShadcnLayoutWrapper>

    <ShadcnLayoutFooter>
      <ShadcnGlobalFooter :links="links" :socials="socials"/>
    </ShadcnLayoutFooter>
  </ShadcnLayout>
</template>

<script setup lang="ts">
// @ts-ignore
import { setLocale } from 'view-shadcn-ui'
import LayoutHeader from '@/views/layouts/components/LayoutHeader.vue'

setLocale('zh-CN')

const links = [
  {
    title: '资源项目',
    links: [
      { label: 'DataCap', href: 'https://datacap.devlive.org', target: '_blank' },
      { label: 'PageForge', href: 'https://pageforge.devlive.org', target: '_blank' },
      { label: 'View Shadcn UI', href: 'https://view-shadcn-ui.devlive.org', target: '_blank' }
    ]
  },
  {
    title: '社区',
    links: [
      { label: 'GitHub', href: 'https://github.com/devlive-community', target: '_blank' },
      { label: 'Discord', href: 'https://discord.devlive.org', target: '_blank' }
    ]
  },
  {
    title: '开源项目',
    links: [
      { label: 'DataCap', href: 'https://datacap.devlive.org', target: '_blank' },
      { label: 'PageForge', href: 'https://pageforge.devlive.org', target: '_blank' },
      { label: 'View Shadcn UI', href: 'https://view-shadcn-ui.devlive.org', target: '_blank' }
    ]
  }
]
const socials = [
  { icon: 'Github', href: 'https://github.com/devlive-community', label: 'https://pageforge.devlive.org' }
]
</script>