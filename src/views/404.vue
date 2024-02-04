<template>
    <div class="error-page">
        <h1>404 Error</h1>
        <p>Page not found</p>
    </div>
</template>

<script>
export default {
    name: 'NotFound',
};
</script>

<style scoped>
.error-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-size: 24px;
    font-weight: bold;
}
</style>
