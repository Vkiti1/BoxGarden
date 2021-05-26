<template>
  <div class="q-pa-lg row justify-center">
    <div class="col" style="max-width: 1000px">
      <q-table
        title="Users"
        :data="users"
        :columns="columns"
        row-key="id"
        flat
        style="min-width: 70%"
      >
        <template v-slot:top>
          <q-btn color="green" label="Add user" @click="onNewUser" />
        </template>
        <template v-slot:body-cell="props">
          <q-td :props="props">
            <div v-if="props.col.name === 'actions'">
              <q-btn
                dense
                color="green"
                icon="edit"
                @click="onUpdateUser(props.row)"
              />
              <q-btn
                dense
                color="green"
                icon="delete"
                @click="onDeleteUser(props.row)"
              />
            </div>
            <div v-else-if="props.col.name === 'adminPrivileges'">
              <q-checkbox
                v-model="props.row.adminPrivileges"
                icon="checkbox"
                disable
              >
              </q-checkbox>
            </div>

            <div v-else>
              {{ props.row[props.col.field] }}
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-if="openDialog" v-model="openDialog">
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <div class="text-h6">User</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input
            ref="Name"
            :error="!userModel.name || userModel.name.length === 0"
            error-message="Name is required."
            label="Name"
            v-model="userModel.name"
          />
          <q-input
            ref="Last Name"
            :error="!userModel.lastName || userModel.lastName.length === 0"
            error-message="Last name is required."
            label="Last Name"
            v-model="userModel.lastName"
          />
          <q-select
            ref="Box Garden"
            :error="userModel.boxGarden === null"
            error-message="Choose a Box garden for this user"
            filled
            v-model="userModel.boxGarden"
            :options="boxGardenIDs"
            label="Box Garden"
          >
          </q-select>
          <q-checkbox
            ref="Admin Privileges"
            :error="!userModel.adminPrivileges"
            error-message="Admin Privileges is required."
            label="Admin Privileges"
            v-model="userModel.adminPrivileges"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="green" label="OK" @click="onOKClick" />
          <q-btn color="green" label="Cancel" @click="onCancelClick" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: "UsersIndex",
  data() {
    return {
      openDialog: false,
      userModel: {
        adminPrivileges: false,
        boxGarden: null,
        name: null,
        lastName: null
      },
      boxGardenIDs: [],
      userID: null,
      users: [],
      columns: [
        {
          name: "id",
          label: "User ID",
          align: "left",
          field: "id",
          sortable: true
        },
        {
          name: "name",
          label: "Name",
          align: "left",
          field: "name",
          sortable: true
        },
        {
          name: "lastName",
          label: "Last Name",
          align: "left",
          field: "lastName",
          sortable: true
        },
        {
          name: "boxGarden",
          label: "Box Garden",
          align: "left",
          field: "boxGarden",
          sortable: true
        },
        {
          name: "adminPrivileges",
          label: "Admin Privileges",
          align: "left",
          field: "adminPrivileges",
          sortable: true
        },
        {
          name: "actions",
          label: "Actions",
          align: "left",
          field: null,
          sortable: false
        }
      ]
    };
  },
  mounted: function() {
    const userCollectionReference = this.$db.collection("user");
    userCollectionReference.get().then(rows => {
      rows.forEach(row => {
        const user = row.data();
        const boxGardenID = user.boxGarden.path.split("/")[1];
        user.boxGarden = boxGardenID;
        this.users.push({ id: row.id, ...user });
      });
    });
    const boxGardenCollectionReference = this.$db.collection("boxGarden");
    boxGardenCollectionReference.get().then(boxGardens => {
      boxGardens.forEach(boxGarden => {
        this.boxGardenIDs.push(boxGarden.id);
      });
    });
  },
  methods: {
    onNewUser() {
      this.openDialog = true;
    },
    async onOKClick() {
      if (
        !this.$refs["Name"].hasError &&
        !this.$refs["Last Name"].hasError &&
        !this.$refs["Box Garden"].hasError
      ) {
        const userCollectionReference = this.$db.collection("user");
        const newUser = {
          ...this.userModel,
          boxGarden: this.$db.doc(`boxGarden/${this.userModel.boxGarden}`)
        };
        if (this.userID) {
          try {
            const docRef = await userCollectionReference
              .doc(this.userID)
              .set(newUser);
            const index = this.users.findIndex(user => user.id === this.userID);
            this.users.splice(index, 1, {
              ...newUser,
              boxGarden: newUser.boxGarden.path.split("/")[1]
            });
          } catch (err) {
            console.log("Error updating user: ", err);
          }

          this.userID = null;
        } else {
          try {
            const docRef = await userCollectionReference.add(newUser);
            this.users.push({
              ...newUser,
              id: docRef.id,
              boxGarden: newUser.boxGarden.path.split("/")[1]
            });
          } catch (err) {
            console.log("Error creating new user: ", err);
          }
        }
        this.userModel = {
          adminPrivileges: false,
          boxGarden: null,
          name: null,
          lastName: null
        };
        this.openDialog = false;
      }
    },
    onCancelClick() {
      this.userModel = {
        adminPrivileges: false,
        boxGarden: null,
        name: null,
        lastName: null
      };
      this.openDialog = false;
    },
    onUpdateUser(user) {
      console.log(user.boxGarden);
      this.userModel = { ...user };
      this.userID = user.id;
      this.openDialog = true;
    },
    onDeleteUser(user) {
      this.$q
        .dialog({
          title: "Delete",
          message: "Confirm deletion.",
          ok: true,
          cancel: true
        })
        .onOk(() => {
          this.$db
            .collection("user")
            .doc(user.id)
            .delete()
            .then(() => {
              this.users.forEach((element, index) => {
                if (element.id === user.id) {
                  this.users.splice(index, 1);
                }
              });
            })
            .catch(err => console.log("Error deleting document: ", err));
        });
    }
  }
};
</script>
