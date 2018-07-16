<template>
  <div class="edit-smoothie container" v-if="smoothie">
    <h2>Edit {{smoothie.title}}</h2>
    <form @submit.prevent="editSmoothie">
      <div class="field title">
        <label for="title">Smoothie title:</label>
        <input type="text" name="title" v-model="smoothie.title" id="title">
      </div>
      <div v-for="(ing, index) in smoothie.ingredients" class="field ingredient" :key="index">
        <label for="ingredient">Ingredient:</label>
        <input type="text" name="ingredient" v-model="smoothie.ingredients[index]" id="ingredient">
        <i @click="deleteIng(ing)" class="material-icons delete">delete</i>
      </div>
      <div class="field add-ingredient">
        <label for="add-ingredient">Add an ingredient (press tab to add):</label>
        <input type="text" name="add-ingredient" @keydown.tab.prevent="addIng" v-model="another" id="add-ingredient">
      </div>
      <div class="field center-align">
        <p v-if="feedback" class="red-text">{{ feedback }}</p>
        <button class="btn pink">Add Smoothie</button>
      </div>
    </form>
  </div>
</template>

<script>
  import db from '@/firebase/init'
  import slugify from 'slugify'

  export default {
    name: "EditSmoothie",
    data () {
      return {
        smoothie: null,
        another: null,
        feedback: null
      }
    },
    methods: {
      editSmoothie () {
        if (this.smoothie.title) {
          this.feedback = null
          this.smoothie.slug = slugify(this.smoothie.title, {
            replacement: '-',
            remove: /[$*_+~.()'"!\-:@]/g,
            lower: true
          })
          db.collection('smoothies').doc(this.smoothie.id).update({
            title: this.smoothie.title,
            ingredients: this.smoothie.ingredients,
            slug: this.smoothie.slug
          }).then(
            () => {
              this.$router.push({name: 'index'})
            }
          ).catch(err => {
            console.log(err)
          })
        } else {
          this.feedback = 'You must add title'
        }
      },
      addIng () {
        if (this.another){
          this.smoothie.ingredients.push(this.another)
          this.another = null
          this.feedback = null
        } else {
          this.feedback = 'You must enter a value to add another ingredient'
        }
      },
      deleteIng (ingredient) {
        this.smoothie.ingredients = this.smoothie.ingredients.filter(ing => {
          return ing !==  ingredient
        })
      }
    },
    created () {
      let ref = db.collection('smoothies').where('slug', '==', this.$route.params.smoothie_slug)
      ref.get().then(snapshot => {
        snapshot.forEach(doc => {
          this.smoothie = doc.data()
          this.smoothie.id = doc.id
        })
      })
    }
  }
</script>

<style scoped>
  .ingredient {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .delete {
    position: absolute;
    right: 0;
    bottom: 16px;
    color: #aaa;
    font-size: 1.4em;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    top: 23px;
  }
</style>
