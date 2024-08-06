document.addEventListener('DOMContentLoaded', requestCategories);
document.addEventListener('DOMContentLoaded', requestBanners);
document.addEventListener('DOMContentLoaded', requestFeaturedProducts);
document.addEventListener('DOMContentLoaded', requestNewArrivals);
document.addEventListener('DOMContentLoaded', checkLoginStatus);
document.addEventListener('DOMContentLoaded', updateCart);

function requestCategories() { // pobiera kategorie
    fetchCall("menu.php",responseCategories);
    function responseCategories(data){
        const nav = document.querySelector('.navigation');
        if(data.categories){
        const ul = document.createElement('ul');
        data.categories.forEach(cat=>{//pobieranie w petli wierszy z kategoriami z bazy danych i wrzucanie ich na strone
            const li = document.createElement('li');
            li.className=cat;
            li.textContent=cat;
            li.addEventListener('click',getCategoryProducts.bind(cat));
            ul.appendChild(li);
        });
        nav.append(ul);    
        }
    }
}

function getCategoryProducts(event){ // pobiera produkty z danej kategorii
    console.log("category click",this);
    const cat = this;
    const main = document.querySelector('main');
    setActiveCategory(cat);
    fetchCall(`product.php?category=${cat}`,responseCategoryProducts);
    function responseCategoryProducts(data){
        console.log(data);
        if(data.products){
            main.innerHTML='';
            populateCatalogue(data.products,main);
        }
    }
}

function setActiveCategory(cat){ //ustawia aktywna kategorie
    const categoryList = document.querySelectorAll(".navigation li");
    const root = document.querySelector(":root");
    const primaryColor = window.getComputedStyle(root).getPropertyValue('--primaryColor');
    categoryList.forEach(category=>{
        if(category.classList.contains(cat)){
            category.style.background=primaryColor;
        }
        else{
        category.style.background="initial";
        }
        
    });
}

function requestBanners() { //pobiera obrazki do przesuwajacego sie banera
    fetchCall("banner.php",responseBanner);
    function responseBanner(data){
                if(data.banners){
            const banners = data.banners
            banners.forEach(banner=>{
            const slide = document.createElement('div');
            slide.className='swiper-slide';
            slide.style.backgroundImage = `url('http://localhost/ProjektWWW/${banner.image}')`;
            slide.style.height='100vh';
            slide.style.backgroundSize='cover';
            const h3=document.createElement('h3');
            h3.textContent = banner.name;
            const p = document.createElement('p');
            p.textContent=banner.description;
            const button = document.createElement('button');
            button.textContent = 'Shop Now';
            slide.appendChild(h3);
            slide.appendChild(p);
            slide.appendChild(button);
            const swiperWrapper = document.querySelector('.swiper-wrapper');
            swiperWrapper.append(slide);
        });
            callSwiper();
        }
    }
}
function callSwiper(){
    const swiper = new Swiper('.swiper', {


  loop: true,

  pagination: {
    el: '.swiper-pagination',
  },


  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});
    
    
}


function requestFeaturedProducts(){
    fetchCall("featured.php",responseFeatured);
    function responseFeatured(data){
        const featured = data.featured;
        const featuredSection = document.querySelector('.featured-products');
        populateCatalogue(featured,featuredSection);
    }

}

function populateCatalogue(products,catalogueParent) { // dodaje produkty z bazy do strony
        if(products){
            //const featuredSection = document.querySelector('.featured-products');
            const catalog = document.createElement('div');
            catalog.className = "catalogue";
            products.forEach(prod=>{
            const card = document.createElement('div');
            card.className = 'card';
            card.addEventListener('click',getProductDetails.bind(prod));
            const imgDiv= document.createElement('div');
            imgDiv.className='card-img';
            const descDiv = document.createElement('div');
            descDiv.className='card-description';
            card.appendChild(imgDiv);
            card.appendChild(descDiv);
            const img = document.createElement('img');
            img.src=`http://localhost/ProjektWWW/${prod.image}`;
            imgDiv.appendChild(img);
            const nameP = document.createElement('p');
            nameP.className='product-name';
            nameP.textContent=prod.name;
            const priceP = document.createElement('p');
            priceP.className='product-price';
            priceP.textContent=`${prod.price}`+' zł';
            descDiv.appendChild(nameP);
            descDiv.appendChild(priceP);
            catalog.appendChild(card);

            });
            catalogueParent.appendChild(catalog);
        }
}


function requestNewArrivals(){ //pobierz z bazy nowo dodane przedmioty
    fetchCall("newArrivals.php",responseNewArrivals);
    function responseNewArrivals(data){
        const newArrivals = data.newArrivals;
        const newArrivalsSection = document.querySelector('.new-arrivals');
        populateCatalogue(newArrivals,newArrivalsSection);
    }
}

//najwazniejsza funkcja do pobierania rzeczy z bazy
function fetchCall(resource, callBack, method='GET',data=undefined){ //pobiera cos z bazy, zaleznie od potrzeby to inny plik jest uzywany
    const url = "http://localhost/ProjektWWW/backend/";
    fetch(url+resource,{
        method:method,
        mode:"cors",
        credentials:"include",
        body:data,
    }).then(res=>res.json()).then(data=>{
        callBack(data);
    }).catch(err=>console.log(err));
    
}

function displayOverlay(modal){ // wyswietla tlo przy wyskakujacych okienkach
        const main = document.querySelector('main');
        const overlay = document.createElement("div");
        overlay.className = "overlay";
        overlay.style.cssText = 
        "position:fixed;top: 0;left: 0;right: 0;width: 100vw;height: 100vh;background-color: #002;opacity: 0.8;z-index:200;";
        overlay.addEventListener('click',removeOverlay);
        main.appendChild(overlay);
        const modalContainer=document.createElement("div");
        modalContainer.className="modal-container";
        modalContainer.style.cssText = 
        "position: fixed;top: 25%;left: 25%;width: 50vw;height: 50vh;background-color: #fff;z-index:200;border-radius:7px;";
        modalContainer.appendChild(modal);
        main.appendChild(modalContainer);
}


function getProductDetails(){
    console.log("produkt:", this);
    fetchCall(`inventory.php?id=${this.category_id}`, responseInventory.bind(this));
    function responseInventory(data){
        //console.log(data);
        const stock =+data.stock;
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.style.cssText="position:fixed;display:grid;grid-template-columns: 1fr 2fr; padding: 10px 20px;"
        const img = document.createElement("img");
        img.src=`http://localhost/ProjektWWW/${this.image}`;
        console.log(img.src);
        img.style.cssText="max-height:47vh;";
        modal.appendChild(img);
        const modalDesc = document.createElement("div");
        modalDesc.className='modal-desc';
        modalDesc.style.cssText="display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding-left:1.5rem";
        modal.appendChild(modalDesc);
        const title = document.createElement("div");
        title.textContent=this.name;
        title.style.cssText="margin-bottom:25px; border-bottom:solid 1px dodgerblue;width:100%;padding:5px 0;font-weight:700;";
        modalDesc.appendChild(title);
        const desc = document.createElement("div");
        desc.textContent=this.description;
        desc.style.cssText="margin-bottom:25px; border-bottom:solid 1px dodgerblue;width:100%;padding:5px 0;";
        modalDesc.appendChild(desc);
        const price = document.createElement("div");
        price.textContent = `${this.price}`;
        price.style.cssText="margin-bottom:25px; border-bottom:solid 1px dodgerblue;width:100%;padding:5px 0;";
        modalDesc.appendChild(price);
        const stockDiv = document.createElement("div");
        switch(true){
               case stock>10:
               stockDiv.textContent='In Stock';
               stockDiv.style.color='green';
               break;
               case stock >0 && stock <= 10:
               stockDiv.textContent=`Only ${stock} left!`;
               stockDiv.style.color='green';
               break;
               case stock == 0:
               stockDiv.textContent='Out of Stock!';
               stockDiv.style.color='red';
               break;
               default:
               stockDiv.textContent='Test';
               break;
               }
        stockDiv.style.cssText="margin-bottom:25px; border-bottom:solid 1px dodgerblue;width:100%;padding:5px 0;";
        modalDesc.appendChild(stockDiv);
        const select = document.createElement("select");
        select.addEventListener("change",updateQuantity.bind(id));
        const counter = stock>10?10:stock;
        for(let i=1; i<=counter; i++){
            const option = document.createElement('option');
            option.value=i;
            option.text=i;
            select.appendChild(option);
        }
        
        select.style.cssText="margin-bottom:25px; border-bottom:solid 1px dodgerblue;width:100%;padding:5px 0;";
        modalDesc.appendChild(select);
        const addToCart=document.createElement('button');
        addToCart.className="add-to-cart";
        addToCart.textContent = "Add to Cart";
        addToCart.addEventListener('click',addProductToCart.bind({id:this.id,image:this.image,price:this.price,stock}));
        addToCart.style.cssText="margin-bottom:25px; border:solid 1px dodgerblue;width:100%;padding:5px 10px; background-color:dodgerblue;cursor:pointer;box-shadow:5px 5px 5px lightgray;border-radius:5px;font-size:large;";
        modalDesc.appendChild(addToCart);
        displayOverlay(modal);
    }

}

function removeOverlay(){
    //const main = document.querySelector('main');
    const overlay = document.querySelector('.overlay');
    const modalContainer = document.querySelector('.modal-container');
    if(overlay){
        overlay.remove();
    }
    if(modalContainer){
        modalContainer.remove();
    }
}

function displayLoginRegisterIcons(){
    showHideIcon(login,false);
    showHideIcon(register,false);
    showHideIcon(logout,true);
    showHideIcon(loggedUser,true);
    
}

function checkLoginStatus(){
    fetchCall('login.php?q=check_status', responseUserLogin);
    function responseUserLogin(data){
        data.user!='guest' && displayLoggedUser(data.user);
        data.user=='guest' && displayLoginRegisterIcons();
        
    }
}
const cartIcon= document.querySelector('.cart');
const localCart={
    cart:null,
    length:0,
    total:0.0,
};
cartIcon.addEventListener('click',showCart);

function updateCart(){
    fetchCall('cart.php', responseUpdateCart);

}

function responseUpdateCart(data){
    const{total,...cart} = data.cart;  
    localCart.cart=cart;
    localCart.total=total;
    localCart.length=Object.keys(cart).length;
    if(localCart.length>0){
        cartIcon.classList.add('cart-not-empty');
        const RootCSS = document.querySelector(':root');
        RootCSS.style.setProperty('--cart-size',`'${localCart.length}'`);
    }else{
        cartIcon.classList.remove('cart-not-empty');
        
    }
}

function addProductToCart(){
    console.log(this);
    const select = document.querySelector("select");
    console.log(select.value);
    const payload = new URLSearchParams();
    payload.append('id', this.id);
    payload.append('image', this.image);
    payload.append('price', this.price);
    payload.append('stock', this.stock);
    payload.append('quantity', select.value);
    fetchCall('cart.php',responseUpdateCart, 'POST',payload);
}

function showCart(){
    setActiveCategory(null);
    const main = document.querySelector("main");
    main.innerHTML="";
    const container = document.createElement('div');
    container.className='cart-container';
    container.style.cssText="    display: grid;grid-template-columns: repeat(4,1fr);width: 80vw;margin: 8rem auto;"
    const imgHeading = document.createElement('div');
    imgHeading.textContent="Item";
    imgHeading.style.cssText= "display: flex;justify-content: center;align-items: center;padding: 2rem 2rem;border-bottom: solid 1px gray;";
    container.appendChild(imgHeading)
    const QuantityHeading = document.createElement('div');
    QuantityHeading.textContent="Quantity";
    QuantityHeading.style.cssText= "display: flex;justify-content: center;align-items: center;padding: 2rem 2rem;border-bottom: solid 1px gray;";
    container.appendChild(QuantityHeading)
    const AvailableHeading = document.createElement('div');
    AvailableHeading.textContent="Available";
    AvailableHeading.style.cssText= "display: flex;justify-content: center;align-items: center;padding: 2rem 2rem;border-bottom: solid 1px gray;";
    container.appendChild(AvailableHeading)
    const OrderValHeading = document.createElement('div');
    OrderValHeading.style.cssText= "display: flex;justify-content: center;align-items: center;padding: 2rem 2rem;border-bottom: solid 1px gray;";
    OrderValHeading.textContent="Order Value";
    container.appendChild(OrderValHeading)
    for(const [id,product] of Object.entries(localCart.cart)){
        const {image, price, quantity, stock} = product;
        const imgDiv = document.createElement('div');
        imgDiv.style.cssText= "display: flex;justify-content: center;align-items: center;padding: 2rem 2rem;border-bottom: solid 1px gray;";
        const imgElm = document.createElement('img');
        imgElm.style.cssText="width: 35%;"
        imgElm.src=`http://localhost/ProjektWWW/${image}`;
        imgDiv.appendChild(imgElm);
        container.appendChild(imgDiv);
        const quantityDiv = document.createElement('div');
        quantityDiv.style.cssText= "display: flex;justify-content: center;align-items: center;padding: 2rem 2rem;border-bottom: solid 1px gray;";
        const select = document.createElement("select");
        select.style.cssText="width:100%;height:30%;margin:auto;";
        const counter = stock>10?10:stock;
            for(let i=1; i<=counter; i++){
                const option = document.createElement('option');
                option.value=i;
                option.textContent=i;
                if(i===+quantity){
                    option.setAttribute('selected','')
                }
                select.appendChild(option);
            }
        quantityDiv.appendChild(select);
        container.appendChild(quantityDiv);
        const stockDiv = document.createElement('div');
        switch(true){
               case stock>10:
               stockDiv.textContent='In Stock';
               stockDiv.style.color='green';
               break;
               case stock >0 && stock <= 10:
               stockDiv.textContent=`Only ${stock} left!`;
               stockDiv.style.color='green';
               break;
               case stock == 0:
               stockDiv.textContent='Out of Stock!';
               stockDiv.style.color='red';
               break;
               default:
               stockDiv.textContent='Test';
               break;
               }
        container.appendChild(stockDiv);
        const priceDiv = document.createElement('div');
        priceDiv.textContent=`${price}`;
        const deleteBtn = document.createElement('button');
        deleteBtn.style.cssText = "padding:.5rem 1rem;background-color: red;margin-left: 2rem;border-radius: 5px;border-color: red;letter-spacing: .1rem;font-size:large;";
        deleteBtn.className='delete-product-btn';
        deleteBtn.textContent='Delete';
        priceDiv.appendChild(deleteBtn);
        container.appendChild(priceDiv);
    }
    const totalDiv = document.createElement('div');
    totalDiv.className='total-div';
    totalDiv.style.cssText= "display: flex;justify-content: right;align-items: center;padding: 2rem 2rem;border-bottom: solid 1px gray;grid-column: span 4;";
    totalDiv.textContent=`Total: ${localCart.total}`;
    container.appendChild(totalDiv);
    const navDiv = document.createElement('div');
    navDiv.className='nav-div';
    const continueShoppingBtn = document.createElement('button');
    continueShoppingBtn.style.cssText = "padding:.5rem 1rem;background-color: red;margin-left: 2rem;border-radius: 5px;border-color: red;letter-spacing: .1rem;font-size:large;";
    continueShoppingBtn.className='continue-shopping-btn';
    continueShoppingBtn.textContent="Continue Shopping";
    navDiv.appendChild(continueShoppingBtn);
    const checkoutBtn = document.createElement('button');
    checkoutBtn.style.cssText = "padding:.5rem 1rem;background-color: red;margin-left: 2rem;border-radius: 5px;border-color: red;letter-spacing: .1rem;font-size:large;";
    checkoutBtn.className='checkout-btn';
    checkoutBtn.textContent="Checkout";
    navDiv.appendChild(checkoutBtn);
    container.appendChild(navDiv);
    main.appendChild(container);
}

function updateQuantity(e){
    const payload = new URLSearchParams();
    payload.append('quantity',e.target.value);
    payload.append('id',this);
    fetchCall('cart.php',responseUpdateQuantity,'PATCH',payload);
    function responseUpdateQuantity(data){
        responseUpdateCart(data);
        showCart();
    }
}