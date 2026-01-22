<template>
  <v-container
    class="fill-height justify-center"
    fluid
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        class="text-center"
        cols="12"
        md="6"
      >
        <div class="text-h2 font-weight-bold text-medium-emphasis mb-4">
          404
        </div>

        <div class="text-h5 font-weight-medium mb-2">
          Halaman Tidak Ditemukan
        </div>

        <div class="text-body-2 text-medium-emphasis mb-6">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </div>

        <v-btn
          color="primary"
          to="/home"
          variant="flat"
        >
          <v-icon
            icon="mdi-home"
            start
          />
          Kembali ke Beranda
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<route lang="yaml">
meta:
  public: true
  layout: blank
</route>
