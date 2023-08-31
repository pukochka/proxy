<template>
  <div class="proxy-stars proxy-stars--sm" />
  <div class="proxy-stars proxy-stars--md" />
  <div class="proxy-stars proxy-stars--lg" />
</template>

<script lang="ts" setup></script>

<style lang="sass" scoped>
$max-viewport-height: 7000

@function generateRandomStars($number-of-stars, $max-viewport-height)
  $value: "#{random($max-viewport-height)}px #{random($max-viewport-height)}px #{var(--q-primary)}"
  @for $i from 1 through $number-of-stars
    $value: "#{$value}, #{random($max-viewport-height)}px #{random($max-viewport-height)}px #{var(--q-primary)}"
  @return unquote($value)


$shadows-sm: generateRandomStars(1000, $max-viewport-height)
$shadows-md: generateRandomStars(600, $max-viewport-height)
$shadows-lg: generateRandomStars(500, $max-viewport-height)

@mixin createStar($size, $box-shadow, $animation-duration)
  animation: animateStar $animation-duration linear infinite
  background: transparent
  box-shadow: $box-shadow
  height: #{$size}px
  width: #{$size}px

.proxy-stars
  position: absolute
  &--sm
    @include createStar(2, $shadows-sm, 70s)
  &--md
    @include createStar(3, $shadows-md, 100s)
  &--lg
    @include createStar(4, $shadows-lg, 150s)

@keyframes animateStar
  from
    transform: translateY(0px)
  to
    transform: translateY(-#{$max-viewport-height/2}px)
</style>
