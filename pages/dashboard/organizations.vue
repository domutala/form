<script lang="ts" setup>
import { mergeProps } from "vue";

const { t } = useI18n();
const panelActive = ref(0);
const auth = useAuth();

useSeoMeta({ title: t("organization.title.organizations") });
</script>

<template>
  <v-container class="mt-16">
    <div
      v-if="!Store.organization.organizations.length"
      class="d-flex align-center justify-center"
      style="margin-top: 100px"
    >
      <i class="fi fi-tr-boxes" style="font-size: 92px; opacity: 0.3"></i>
    </div>

    <v-expansion-panels
      v-else
      v-model="panelActive"
      variant="accordion"
      bg-color="background"
      flat
      class="border rounded"
    >
      <v-expansion-panel
        v-for="(item, index) in Store.organization.organizations"
        :key="index"
        :class="index !== 0 ? 'border-t' : ''"
      >
        <template #title>
          {{ item.name }}

          <v-spacer />
          <div
            v-if="panelActive === index && item.owner === auth.user.value?.uid"
            class="pr-3 d-flex align-center ga-2"
          >
            <ui-organization-remove :organization="item">
              <template #activator="{ props }">
                <v-tooltip :text="$t('remove')" location="top">
                  <template v-slot:activator="{ props: tooltipProps }">
                    <v-btn
                      icon
                      size="x-small"
                      variant="text"
                      color="red"
                      v-bind="mergeProps(tooltipProps, props)"
                    >
                      <svg-icon name="trash" width="20" height="20" />
                    </v-btn>
                  </template>
                </v-tooltip>
              </template>
            </ui-organization-remove>

            <ui-organization-member-invite :organization="item">
              <template #activator="{ props }">
                <v-tooltip text="add" location="top">
                  <template v-slot:activator="{ props: tooltipProps }">
                    <v-btn
                      icon
                      size="x-small"
                      variant="text"
                      color="dark"
                      v-bind="mergeProps(tooltipProps, props)"
                    >
                      <svg-icon name="user-add" width="20" height="20" />
                    </v-btn>
                  </template>
                </v-tooltip>
              </template>
            </ui-organization-member-invite>

            <ui-organization-create :organization="item">
              <template #activator="{ props }">
                <v-tooltip :text="$t('rename')" location="top">
                  <template v-slot:activator="{ props: tooltipProps }">
                    <v-btn
                      icon
                      size="x-small"
                      variant="text"
                      color="dark"
                      v-bind="mergeProps(tooltipProps, props)"
                    >
                      <i class="fi fi-tc-pencil" style="font-size: 18px"></i>
                    </v-btn>
                  </template>
                </v-tooltip>
              </template>
            </ui-organization-create>
          </div>
        </template>
        <template #text>
          <v-list class="pa-2" bg-color="transparent">
            <ui-organization-member
              v-for="(member, m) in item.members"
              :key="m"
              :organization="item"
              :member="member"
            >
              <template #default="{ user, fetching }">
                <v-list-item
                  v-if="fetching"
                  rounded="lg"
                  class="border pa-3 mb-2"
                >
                  <div class="d-flex align-center ga-3">
                    <div
                      class="skeleton"
                      style="width: 35px; height: 35px; border-radius: 100%"
                    ></div>

                    <div
                      class="skeleton"
                      style="width: 200px; max-width: 50%; border-radius: 0.6em"
                    ></div>

                    <v-spacer />

                    <div
                      class="skeleton"
                      style="width: 50px; border-radius: 0.6em"
                    ></div>
                  </div>
                </v-list-item>

                <div v-else-if="user" class="mb-4 position-relative">
                  <v-list-item rounded="lg" class="border pa-3">
                    <div class="d-flex align-center ga-3">
                      <v-avatar size="32">
                        <v-img
                          v-if="user.photoURL"
                          :src="user.photoURL"
                        ></v-img>
                        <svg-icon v-else name="avatar" />
                      </v-avatar>

                      <div style="line-height: 1">
                        {{ user.displayName }}
                        <div
                          style="font-size: 12px; margin-top: 2px; opacity: 0.5"
                        >
                          {{ user.email }}
                        </div>
                      </div>

                      <v-spacer />
                      <ui-organization-member-state
                        :member="member"
                        :organization="item"
                      />
                    </div>
                  </v-list-item>
                  <div style="position: absolute; bottom: -12px; left: 10px">
                    <v-chip
                      v-if="member.uid === item.owner"
                      size="x-small"
                      color="primary"
                      variant="flat"
                    >
                      {{ $t("organization.title.owner") }}
                    </v-chip>
                    <v-chip
                      v-else-if="member.state === 'invited'"
                      size="x-small"
                      color="warning"
                      variant="flat"
                    >
                      {{
                        member.uid === auth.user.value?.uid
                          ? $t("organization.member.title.invitationReceived")
                          : $t("organization.member.title.invitationSent")
                      }}
                    </v-chip>
                    <v-chip
                      v-if="member.state === 'leave'"
                      size="x-small"
                      color="grey-lighten-2"
                      variant="flat"
                    >
                      {{ $t("organization.member.state.leave") }}
                    </v-chip>
                    <v-chip
                      v-if="member.state === 'disabled'"
                      size="x-small"
                      color="grey-lighten-2"
                      variant="flat"
                    >
                      {{ $t("organization.member.state.disabled") }}
                    </v-chip>
                  </div>
                </div>
              </template>
            </ui-organization-member>
          </v-list>
        </template>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
