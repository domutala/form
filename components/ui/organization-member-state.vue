<script lang="ts" setup>
import type { IMember, IOrganization } from "~/models/Organization";

const props = defineProps({
  organization: { type: Object as PropType<IOrganization>, required: true },
  member: { type: Object as PropType<IMember>, required: true },
});
const i18n = useI18n();
const auth = useAuth();
const submitting = ref(false);

async function setState(state: string) {
  if (submitting.value) return;

  try {
    submitting.value = true;
    await Store.organization.setMemberState({
      organization: props.organization.id,
      uid: props.member.uid,
      state,
    });
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div v-if="!member.owner">
    <v-progress-circular v-if="submitting" size="20" indeterminate />
    <div
      v-else-if="
        member.state === 'invited' && member.uid === auth.user.value?.uid
      "
      class="d-flex align-center ga-1"
    >
      <v-btn size="small" color="dark" rounded @click="setState('decline')">
        {{ $t("organization.member.title.declined") }}
      </v-btn>
      <v-btn size="small" color="dark" rounded @click="setState('accepted')">
        {{ $t("organization.member.title.accepted") }}
      </v-btn>
    </div>

    <div v-else-if="member.state === 'accepted'">
      <v-btn
        v-if="member.uid === auth.user.value?.uid"
        size="small"
        color="dark"
        rounded
        @click="setState('leave')"
      >
        {{ $t("organization.member.title.leave") }}
      </v-btn>

      <v-btn
        v-else-if="organization.owner === auth.user.value?.uid"
        size="small"
        color="dark"
        rounded
        @click="setState('disabled')"
      >
        {{ $t("organization.member.title.disabled") }}
      </v-btn>
    </div>
  </div>
</template>
