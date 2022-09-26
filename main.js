let title = document.getElementById('title');
let price = document.getElementById('price');
let ads = document.getElementById('ads');
let taxes = document.getElementById('taxes');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let createBtnSt = document.querySelector('.createBtnSt');
let updateBtnSt = document.querySelector('.updateBtnSt');

let scrollUPbtn = document.getElementById('scrollUPbtn');
let createAleart = document.getElementById('createAleart');
let outputs = document.getElementById('outputs');
let tbody = document.getElementById('tbody');
let search = document.getElementById('search');
let mood = 'create';
let searchMood = 'Title';
let copyUpdaeIndex = 0;   // عن طريق اخذ نسخة منه his block خارج local حتى نحل مشكلة عدم استخدام المتغير global هذا متغير
var totalResult = 0;
let dataProduct;

if (localStorage.product != null ) {
    dataProduct = JSON.parse(localStorage.product);
}
else {
    dataProduct = [];
}


window.onscroll = _ =>  {   if (scrollY > 444)  scrollUPbtn.classList.remove("hidden");
                            else                scrollUPbtn.classList.add("hidden");
                        }


/******************* scroll up */
function scrollUP()
{
    scroll ({
                top: 0,
                behavior: 'smooth',
            });
} //------------------------------- scrollUP()


/******************* get total ***/
function getTotal()
{
    if (price.value != '')
    {
        totalResult = (+price.value + +ads.value + +taxes.value);

        if (+discount.value > 0  &&  +discount.value <= 100)
            totalResult -= (totalResult * +discount.value / 100);

        total.innerHTML = `total: ${ totalResult }$`;
    }
    else
        total.innerHTML = 'total:';
} //--------------------------------- getTotal()


/*******************  clear data ***/
function clearData()
{
    title.value = '';
    price.value = '';
    ads.value = '';
    taxes.value = '';
    discount.value = '';
    total.innerHTML = 'total:';
    totalResult = '';
    count.value = '';
    count.placeholder = 'Count';
    category.value = '';
} //------------------------- clearData()


/****************** <tr> block */
function trBlock(k)
{
    let x = `
            <tr>
                <td>${k+1}</td>
                <td>${dataProduct[k].title}</td>
                <td>${dataProduct[k].price}</td>
                <td>${dataProduct[k].ads}</td>
                <td>${dataProduct[k].taxes}</td>
                <td>${dataProduct[k].discount}</td>
                <td>${dataProduct[k].total}$</td>
                <td>${dataProduct[k].category}</td>
                <td><button id="update" onclick="updateData ( ${k} )">Update</button></td>
                <td><button id="delete" onclick="deleteProduct ( ${k} )">Delete</button></td>
            </tr>`;
    return x;
} //---------------- trBlock()


/****************** show data ***/
function showData()
{
    if (dataProduct.length > 0)
    {
        let table = '';

        for (let i = 0 ; i < dataProduct.length ; i++)
            table += trBlock(i);

        tbody.innerHTML = table;
        document.getElementById('deleteAll').innerHTML = `Clear All (${dataProduct.length})`;

        outputs.classList.remove("hidden");
        createAleart.classList.add("hidden");
    }
    else {
        outputs.classList.add("hidden");
        createAleart.classList.remove("hidden");

        if (mood == 'update')   clearData();
    }
}
showData();


/************************** create product ***/
function create_update()
{
    let newProduct = {
        title: title.value.toLowerCase(),
        price: price.value,
        ads: ads.value,
        taxes: taxes.value,
        discount: discount.value,
        total: totalResult,
        count: count.value,
        category: category.value.toLowerCase(),
    } //--------------------------------------- newProduct{}

    if ((title.value != '') && (price.value != '') && (category.value != ''))
    {
        if (mood === 'create')
        {
            if (newProduct.count < 100)
            {
                if (newProduct.count > 1) //..................... if (count > 1)
                    for (let i = 1 ; i < newProduct.count ; i++)
                        dataProduct.push(newProduct);
                
            dataProduct.push(newProduct);
            clearData();
            }
            else
            {
                count.value = '';
                count.placeholder = 'MAX Count: 99';
                count.focus();
            }
        }
        else //.................................. when (mood === 'update')
        {
            dataProduct[copyUpdaeIndex] = newProduct; //... copyUpdaeIndex: have th value of product index we r wanna to update it ,,, its = i

            //... we put the mood back to its default ,, to create
            mood = 'create';
            //create.innerHTML = 'Create'; 
            
            //.. make input count block and return style of button also to default
            count.style.display = 'block';
            createBtnSt.style.display = 'block';
            updateBtnSt.style.display = 'none';
            clearData();
        }
    }
    else
    {
        if (title.value == '')          title.focus();
        else if (price.value == '')     price.focus();
        else                            category.focus();
    }
    localStorage.setItem('product', JSON.stringify(dataProduct));

    
    showData();
} //------------ create_update()


/************************ delete specific product ***/
function deleteProduct(i)
{
    dataProduct.splice(i,1);
    localStorage.product = JSON.stringify(dataProduct);

    showData();
} //-------------- deleteProduct()


/******************* delete all products ***/
function deleteAll()
{
    localStorage.clear();
    dataProduct.splice(0);

    showData();
    clearData();
    mood = 'create';
    count.style.display = 'block';
    createBtnSt.style.display = 'block';
    updateBtnSt.style.display = 'none';
} //---------------- deleteAll()


/********************* update data ***/
function updateData(i)
{
    mood = 'update';
    copyUpdaeIndex = i; //.... copy value of i in copyUpdaeIndex ,, to made it global in pur program

    title.value = dataProduct[i].title;
    price.value = dataProduct[i].price;
    ads.value = dataProduct[i].ads;
    taxes.value = dataProduct[i].taxes;
    discount.value = dataProduct[i].discount;
    category.value = dataProduct[i].category;

    getTotal(); // to get total of price of product we r wanna to update
    scrollUP();
    count.style.display = 'none';
    updateBtnSt.style.display = 'block';
    createBtnSt.style.display = 'none';
} //------------------- updateData()


/************************* search mood */
function getSearchMood(id)
{
    if (id == 'searchTittle')
        searchMood = 'Title';

    else
        searchMood = 'Category';

    search.placeholder = `Saerch By ${searchMood}`;

    search.focus();
    
    search.value = '';
    showData(); //.........to show our data again
} //-------------- getSearchMood()


/********************************** search products */
function searchProducts(value)
{
    let table = '';

    for (let i = 0 ; i < dataProduct.length; i++) {
        if (searchMood == 'Title') {
            if ( dataProduct[i].title.includes(value.toLowerCase()) ) {
                table += trBlock(i);
            }
        }
        else {
            if ( dataProduct[i].category.includes(value.toLowerCase()) ) {
                table += trBlock(i);
            }
        }
    }
    
    tbody.innerHTML = table;
} //------------------------- searchProducts()