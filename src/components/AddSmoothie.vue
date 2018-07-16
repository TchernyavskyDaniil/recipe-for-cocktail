<template>
  <div class="add-smoothie container z-depth-1">
    <h2 class="center-align indigo-text">Add New Smoothie Recipe</h2>
    <form @submit.prevent="addSmoothie">
      <div class="field title">
        <label for="title">Smoothie title:</label>
        <input type="text" name="title" v-model="title" id="title">
      </div>
      <div v-for="(ing, index) in ingredients" class="field ingredient" :key="index">
        <label for="ingredient">Ingredient:</label>
        <input type="text" name="ingredient" v-model="ingredients[index]" id="ingredient">
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
    name: 'AddSmoothie',
    data () {
      return{
        title: null,
        ingredients: [],
        another: null,
        feedback: null,
        slug: null
      }
    },
    methods: {
      addSmoothie () {
        if (this.title) {
          this.feedback = null
          this.slug = slugify(this.title, {
            replacement: '-',
            remove: /[$*_+~.()'"!\-:@]/g,
            lower: true
          })
          db.collection('smoothies').add({
            title: this.title,
            ingredients: this.ingredients,
            slug: this.slug
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
        if (this.another) {
          this.ingredients.push(this.another)
          this.another = null
          this.feedback = null
        } else {
          this.feedback = 'You must enter a value to add another ingredient'
        }
      },
      deleteIng (ingredient) {
        this.ingredients = this.ingredients.filter(ing => {
          return ing !==  ingredient
        })
      }
    }
  }
</script>

<style>
  .add-smoothie {
    margin-top: 60px;
    padding: 20px;
    max-width: 500px;
  }
  
  .add-smoothie h2 {
    font-size: 2em;
    margin: 20px auto;
  }
  
  .add-smoothie .field {
    margin: 20px auto;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  
  .ingredient {
    position: relative;
  }

  .ingredient .delete {
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
