<script>
  import Note from './Note.svelte';
  export let notes = [];
  export let updateNotes = undefined;
</script>

<div class="note-container">
  {#each notes as note}
    <Note {note} {updateNotes} />
  {/each}
</div>

<style>
  .note-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }
</style>
