<script lang="ts" setup>
import type { User } from "firebase/auth";
import type { IOrganization } from "~/models/Organization";

const { $firebase } = useNuxtApp();

const props = defineProps({
  organization: { type: Object as PropType<IOrganization>, required: true },
  id: { type: String, required: true },
});

const fetching = ref(false);
const user = ref<User>();

onMounted(mounted);
async function mounted() {
  try {
    fetching.value = true;
    user.value = await Api.fetch({
      url: `member/${props.organization.id}/${props.id}`,
    });
  } finally {
    fetching.value = false;
  }
}
</script>

<template>
  <slot :fetching="fetching" :user="user" />
</template>
