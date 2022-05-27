<script>
  import NotesContainer from './NotesContainer.svelte';
  export let notes;
  export let updateNotes = undefined;
  console.log('Fridge component notes', notes);
</script>

<div class="fridge">
  <NotesContainer {notes} {updateNotes} />
</div>

<style>
  .fridge {
    flex-grow: 3;
    background-image: url('/static/assets/fridge.jpg');
    /* background-repeat: no-repeat; */
    background-size: 100% 100%;
    width: 976px;
    padding-top: 3rem;
    padding-bottom: 3rem;
    padding-left: 16rem;
    padding-right: 2rem;
  }

  @media only screen and (max-width: 1384px) {
    .fridge {
      padding-left: 14rem;
      padding-right: 1px;
    }
  }
</style>
