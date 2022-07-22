<template>
  <picture v-if="list.length">
    <source v-for="(image, idx) in list" :key="idx"
      :srcset="Array.isArray(image.srcset) ? image.srcset.join(', ') : image.srcset"
      :media="image.media ? `(min-width: ${image.media}px)` : null"
      :width="image.width ? image.width : null"
      :height="image.height ? image.height : null"
      :type="image.type ? image.type : null"
    />
    <img v-bind="$attrs" :src="fallbackImage" />
  </picture>
</template>

<script>
export default {
  name: 'Picture',

  inheritAttrs: false,

  props: {
    images: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    list({ images } = this) {
      if (!Array.isArray(images)) console.trace();
      const preferredOrderOfTypes = [
        'image/jxl',
        'image/webp',
        'image/avif',
        'image/jpg',
        'image/png',
        'image/gif',
      ].reduce((acc, cur, idx) => ({ ...acc, [cur]: idx }), {});

      return Array.isArray(images)
        ? images
          .filter((x) => !!x.srcset)
          .sort((a, b) => (b.media || 0) - (a.media || 0)
            || (preferredOrderOfTypes[a.type] || 0) - (preferredOrderOfTypes[b.type] || 0))
        : [];
    },

    fallbackImage({ list } = this) {
      const commonTypes = [
        'image/jpg',
        'image/png',
        'image/gif',
      ];

      const image = list.find((x) => commonTypes.includes(x.type)) || list[list.length - 1];

      return Array.isArray(image.srcset)
        ? image.srcset[0]?.trim().split(' ')[0]
        : image.srcset.trim().split(' ')[0];
    },
  },
};
</script>
