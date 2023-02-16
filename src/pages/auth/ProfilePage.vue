<template>
  <q-card>
    <q-card-section class="row">
      <div class="text-h6 col">
        Perfil del usuario <strong>{{ currentUser?.login }}</strong>
      </div>
      <div class="col text-right">
        <q-btn label="Cerrar sesi&oacute;n" @click="doLogout" />
      </div>
    </q-card-section>

    <q-card-section>
      <q-splitter v-model="splitterModel" :limits="[10, 25]">
        <template v-slot:before>
          <q-tabs v-model="tab" vertical class="text-grey" active-color="primary">
            <q-tab name="data" label="USUARIO" icon="person" />
            <q-tab name="roles" label="ROLES" icon="group" />
            <q-tab name="permissions" label="PERMISOS" icon="manage_accounts" />
          </q-tabs>
        </template>

        <template v-slot:after>
          <q-tab-panels
            v-model="tab"
            animated
            swipeable
            vertical
            transition-prev="jump-up"
            transition-next="jump-up"
          >
            <q-tab-panel name="data">
              <div class="text-h6">Datos del usuario</div>
              <strong>Usuario:</strong>
              {{ currentUser?.login }}
              <br />

              <strong>Nombre:</strong>
              {{ currentUser?.nombre }}
              <br />
              <strong>Email:</strong>
              {{ currentUser?.email }}
            </q-tab-panel>

            <q-tab-panel name="roles">
              <q-list separator>
                <q-item v-for="role in currentUser?.roles" :key="role.id" v-ripple>
                  <q-item-section>{{ role }}</q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>

            <q-tab-panel name="permissions">
              <ph-permissions-tree
                kind="user"
                :kindId="userID"
                :isUserAdmin="isAdmin"
                :canEdit="false"
              ></ph-permissions-tree>
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import useAuth from '../../composables/useAuth';
import { RolesEnum } from 'src/enums';
import PhPermissionsTree from 'src/components/auth/PhPermissionsTree.vue';

const tab = ref('data');
const splitterModel = ref(15);
const { currentUser, logout } = useAuth();
const router = useRouter();
const mounted = ref(false);

const userID = computed(() => {
  // para que cambie userID al llamar al tree, sino no se cargan los datos
  return mounted.value ? currentUser.value?.id_usuario : 0;
});

const isAdmin = computed(() => {
  return !!currentUser?.value?.roles_code?.find((role) => role === RolesEnum.ADMIN);
});

onBeforeMount(() => {
  if (!currentUser?.value) {
    router.push({ name: 'Login' });
  }
});

onMounted(() => {
  mounted.value = true;
});

const doLogout = () => {
  logout();
  router.push({ name: 'Login' });
};
</script>
