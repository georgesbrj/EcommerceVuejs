const vm = new Vue ({
 el: "#app",
 data:{
     products:[],
     product:false,
     cart:[], 
     cartAtive: false,
     messageAlert : "Item adicionado", 
     alertActive: false,
 },

 filters:{
    numberPrice(valor){
    return valor.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
    }
 },

 computed: {
     cartTotal(){
     let  total = 0;
     if(this.cart.length){
         this.cart.forEach(item => {
             total+= item.price;
            console.log(item);  
         })
     }

        return total;
     }
 },

 methods: {
    fetchProducts(){
        fetch("./api/produtos.json")
        .then( r => r.json())
         .then(r => {
          this.products = r ;
         }) 
    },
    fetchProduct(id){
     fetch(`./api/produtos/${id}/dados.json`)
     .then(r => r.json())
     .then(r => {
         this.product = r;
     })
    },
    openModal(id){
     this.fetchProduct(id);
     window.scrollTo({
         top:0,
         behavior: "smooth"
     })
    },
    closeModal({target, currentTarget}){
     if(target === currentTarget) this.product = false;
    },
    clickOutCart({target, currentTarget}){
        if(target === currentTarget) this.cartAtive = false;
       },
    
    addItem(){
        this.product.stock--;
        const {id,name,price} = this.product;
        this.cart.push({id,name,price});
        this.alert(`${name} adicionado ao carrinho`);
    },
    removeItem(index){
        this.cart.splice(index,1);
    },
    chekLocalStorage(){
        if(window.localStorage.cart){
            this.cart = JSON.parse(window.localStorage.cart);
        }
    },
    compareStock(){
      const items = this.cart.filter(({id}) => id === this.product.id);
      this.product.stock  -= items.length;
    },
    alert(message){
      this.messageAlert = message;
      this.alertActive = true;
      setTimeout(() =>{
          this.alertActive = false;
      },1500); 
    },
    route(){
        const hash = document.location.hash;
        if(hash)
           this.fetchProduct(hash.replace("#",""));
    }

 },
 
 watch:{
    product(){
      document.title = this.product.name || "Tecnno";
      const hash = this.product.id || "";
      history.pushState(null,null,`#${hash}`);
      if(this.product){
        this.compareStock();
      }
      
    },
     cart(){
         window.localStorage.cart = JSON.stringify(this.cart);
     }
 },

 created(){
     this.fetchProducts();
     this.route();
     this.chekLocalStorage();
      
 }

});



