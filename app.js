
// creating Modules using the concept of closures and IIFE to protect the data so that it can't be accessed from outside 

//1st Module's Secret  it return an object that contains all the functions that
// we want to be public (accessed from outside)

/*
budgetController.publicTest(2);
the budgetController function is declared and immediately called
the var x and the function add are declared 
we return an object that contains the function
publicTest()



var budgetController = (function(){
   
    // not accessible using : budgetController.x
    var x=20;
    
    //Also Private 
    var add = function(a)
    {
        return x+a;
    }

    // exploiting the power of closure (scope chain stays intact)
    return {
        // those are the function that we can use from outide
         publicTest:function(b)
        { 
           return(add(b));
        }
    }

})();

//  The 2 modules are independant from each other 



var UIController = (function()
{

    // some Code



})();

// the conroller module that connect the other modules so pass them in parameter 
// we pass them in parameter instead of using directly because in case we change the module then we need to change 
// its name inside the controller as well ( not a good GCP )
var conroller = (function(budgetCtrl,UICtrl){

    var z=budgetCtrl.publicTest(5);

    return {
        anotherPublic:function()
        {
            console.log(z);
        }
    }


})(budgetController,UIController);

*/





// budget conroller : handles Data
var budgetController = (function(){
  // 
    var Expense = function(id,description,value)
   {
       this.id=id,
       this.description=description,
       this.value=value,
       this.percentage=-1;
   };

   Expense.prototype.calcPercentage=function(totalIncome)
   {
       if(totalIncome>0)
        {
            this.percentage = Math.round((this.value/totalIncome)*100); 
        }else{
            this.percentage=-1;
        }
   };
   Expense.prototype.getPercentage = function()
   {
       return this.percentage;
   }

    var Income = function(id,description,value)
   {
       this.id=id,
       this.description=description,
       this.value=value
   };


  
  // Data Structure using Object that contains 2 objects   
    var data ={
       
        allItems :{
           exp:[],
           inc:[]
       },
       totals:{
           exp:0,
           inc:0
       },
       budget:0,
       percentage:-1,
       percentages:[]

    };



    var totalOf= function(type)
    {
        var sum=0;
        data.allItems[type].forEach(i => {
            sum+=i.value;
        });
          
      data.totals[type]=sum;
     
    }

    return {
        // object that contains methods : type (inc or exp) , designation , value
        addItem : function(type,des,val)
        {
            var newItem,ID;
            //[1 3 4 6] NEXT ID IS 7
            // ID= last id +1
            // Create new ID
            if(data.allItems[type].length===0)
            {
                ID=0;
            }else{
                // ACCESS THE ID of The last item and increment the id
                ID=data.allItems[type][data.allItems[type].length-1].id+1;
            }
            // Create new item based on 'inc' or 'exp' type
            if(type ==='exp')
            {
                newItem = new Expense(ID,des,val);
               // data.allItems.exp.push(newItem);
                data.totals.exp++;
            }else if(type==='inc')
            {
                newItem= new Income(ID,des,val);
               // data.allItems.inc.push(newItem);
                data.totals.inc++;

            }
            // push it into our data structure
            data.allItems[type].push(newItem);
             
            // Return the new item
            return newItem;

        },
        caluclateBudget :function()
        {
            // calulcate total income and expenses
            totalOf('inc');
            totalOf('exp');

            // caluclate the budget : income - expenses
            data.budget=data.totals.inc - data.totals.exp;
            // calulcate the percentage of income that we spent  exp=50 and inc = 100 then perc = 50 perc
           if(data.totals.inc>0)
           {
            data.percentage= Math.round((data.totals.exp/data.totals.inc)*100);
           }else{
            data.percentage=-1;
           }
            
        },
         getBudget :function()
         {
            return {
                budget :data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                percentage:data.percentage
            };
         },

         deleteItem :function(type,ID)
         {
            //ids = [1 3 5 6] id=6 but index equal to 3 -->
            var ids = data.allItems[type].map(function(current)// return a new array
            {
               return current.id;// form an array of ids of the elements 
            });
            var index=ids.indexOf(ID);//[1 3 5 6] id=6 but index equal to 3
            if(index !== -1)// didn't find an element
            {
                data.allItems[type].splice(index, 1);
            }

         },// percentage of expenses from income 
         calulatePercentages : function()
         {
             // get the total of income
             var totInc=data.totals.inc;
             
             expenses= data.allItems['exp'].forEach(function(current)
             {
                current.calcPercentage(totInc);
             });
            
           
         },
         getPercentages : function()
         {
           var allPerc= data.allItems.exp.map(function(cur)
           {
               return cur.getPercentage();
           });
           return allPerc;
         },
        testing : function() {
            console.log(data);
        } 
    }



  
})();


// UI conTroller
var UIController = (function()
{
     // in case we change name classes in the html  we have a central object 
   var DOMstring = {
      
       inputType:'.add__type',
       inputdescrption:'.add__description',
       inputValue : '.add__value',
       inputBtn :'.add__btn',
       incomeContainer:'.income__list',// in order to toggle the new item
       expenseContainer:'.expenses__list',
       budgetValue :'.budget__value', 
       incomeValue :'.budget__income--value',
       expenseValue :'.budget__expenses--value',
       budgetExpensesPerc :'.budget__expenses--percentage',
        container:".container",
        expensesPercLabel :'.item__percentage',
        dateLabel:'.budget__title--month'
   };

   var formatNumber =  function(num,type)
         {
             var numSplit,int,dec;
            /*
            + or - Before number
            exactly 2 decimal points
            comma separating the thoudans
            2310.4567 -> +2,310.46
            */

            num = Math.abs(num);
            num = num.toFixed(2); //  exactly 2 decimal points  // this is a method of the number prototype -> JS converts them to object 
            numSplit = num.split('.');
            int = numSplit[0];
            dec = numSplit[1];
            if(int.length>3)
            {
                int = int.substr(0,int.length-3) +','+int.substr(int.length-3,3);// Inp 22345 6> 22,345
            }
             return (type === 'exp' ?'-': '+')+' '+int+'.'+dec;   
         };

      // list = fields , callback when we want to pass a function 
      var nodeListForEach = function(list,callback)
      {
          for(var i=0;i<list.length;i++){
              callback(list[i],i);
          }

      };
   

    return {
        // function to Add The items
         getInput:function()
         { 
             // return an object conatins the 3 inputs that we can access later 

             return {
                type :document.querySelector(DOMstring.inputType).value,// will be either inc or exp 
                description:document.querySelector(DOMstring.inputdescrption).value,
                value : parseFloat(document.querySelector(DOMstring.inputValue).value)

                   }
         },
         // function that add the item to the list 
         addListItem : function(obj,type)
         {
             
             var html,newHtml,element;
             // create HTML string with placeholder text '  """"   '  single quote
            if(type==='inc')
            {
             element=DOMstring.incomeContainer;
             html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>';
            }else if(type==='exp')
            {
                element=DOMstring.expenseContainer;
                html= '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeHolder text with some actual data
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));
            
           // Insert  the HTML into the DOM using the method insertAdjacentHTML(position,test ) 
              // we use the 'beforeend' just inside the element after its last child
              document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);   

         },
         // get DomStrings
         getDOMString:function()
         {
             return DOMstring;
         }
         ,
         clearFields:function()
         {
             var fields,fieldsArr;// is a list
            // it returns a list but it doesn't have methods that we use in arrays
             fields = document.querySelectorAll(DOMstring.inputdescrption+ ','+DOMstring.inputValue);
             // convert list to array 
             fieldsArr= Array.prototype.slice.call(fields);

             fieldsArr.forEach(function(cuurent,index,array)
             {
                 cuurent.value="";
             });

             // Set the focus on the 1st Element
             fieldsArr[0].focus();

             // OR simply
               // document.querySelector(DOMstring.inputdescrption).value="";
           // document.querySelector(DOMstring.inputValue).value=0;


         },
         displayBudget : function(obj)
         {
             var type ;
             obj.budget>0 ? type='inc':type ='exp';
             document.querySelector(DOMstring.incomeValue).textContent=formatNumber(obj.totalInc,'inc');
             document.querySelector(DOMstring.expenseValue).textContent=formatNumber(obj.totalExp,'exp');
             document.querySelector(DOMstring.budgetValue).textContent=formatNumber(obj.budget,type);

            if(obj.percentage>0)
            {
                document.querySelector(DOMstring.budgetExpensesPerc).textContent=obj.percentage + '%';

            }else{
                document.querySelector(DOMstring.budgetExpensesPerc).textContent='---';
            }

         },
         displayPercentage : function(percentages)
         {
             // selecting all the elements with the id   and it return a nodeList 
            var fields = document.querySelectorAll(DOMstring.expensesPercLabel);
           
            nodeListForEach(fields,function(current,index){
                if(percentages[index] >0)
                {
                    current.textContent=percentages[index]+"%";
                }else{
                    current.textContent='---';
                }

            });

         },
         deleteListItem : function(selectorId)
         {
             // we can only remove a child element in js so we need to move up 
             var el=document.getElementById(selectorId);
             el.parentNode.removeChild(el);
            
         },
         displayMonth: function()
         {
            var now,year,month,months;
              now = new Date();
              year= now.getFullYear();
              months=['january','february','march','april','mai','june','july','august','septembre','october','november','december']
              month=now.getMonth();

              document.querySelector(DOMstring.dateLabel).textContent =months[month]+' '+ year;


         },
         changedType : function()
         {
             var fields = document.querySelectorAll(DOMstring.inputType+','+ DOMstring.inputdescrption+','+
             DOMstring.inputValue)

             nodeListForEach(fields, function(curr){
            // it adds if it's not there and add removes it if it's there 
              curr.classList.toggle('red-focus');
             });
             document.querySelector(document.querySelector(DOMstring.inputBtn).classList.toggle('red'));
         }
         
       
     };


})();

// Global App controller : controls everything (the connection between the modules ) : take others Modules in parameter
var controller = (function(budgetCtrl,UICtrl)
{
    
    var setupEventListeners = function()
    {
        var DOM = UICtrl.getDOMString();
        

        document.querySelector(DOM.inputBtn).addEventListener('click',function()
        { 
                ctrlAddItem();                
            
        });

         // if the user click enter key or keypress ---> check key event in js 
       document.addEventListener('keypress',function(event)
       {
          // console.log(event);--> keyCode of each button
            // Respect DRY RULE

            if(event.keyCode===13 || event.which===13)
            {
                ctrlAddItem(); 
            }

       });
       // the callback of an event listener has alaways acces to event object 
       document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
       // handle inc/exp colors 
       document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);
    };


    var updateBudget= function()
    {
         // 1.Caluclate the budget
         budgetCtrl.caluclateBudget();
         //2.return budget 
         var budget = budgetCtrl.getBudget();

        // 3.DISPLAY THE BUDGET ON THE UI 
        UICtrl.displayBudget(budget);
       // console.log(budget);

      
    }
     // called each time we delete or add item
    var updatePercentages = function()
    {
        // 1.calculate percentages 
         budgetCtrl.calulatePercentages();
        //2.read them from the budget controller 
        var percentages = budgetCtrl.getPercentages();
        //3.Update the UI with the new percentages
        UICtrl.displayPercentage(percentages);

    }
 
    var ctrlAddItem = function()
    {
        var input,newItem;
            // 1.GET THE FIELD INPUT DATA 
             input = UICtrl.getInput();
            //console.log(input);
        if(input.description!=="" && !isNaN(input.value) && input.value>0)
          {  // 2.ADD THE ITEM TO THE BUDGETCONTOLLER 
             newItem = budgetController.addItem(input.type,input.description,input.value);
             // 3. ADD THE ITEM TO THE UI
             UICtrl.addListItem(newItem,input.type);
             // 4.Clear the Inputs Data
             UICtrl.clearFields();

             // 5.update and display budget
             updateBudget();
             //6.Calulcate and update percentages 
             updatePercentages();
         }
           
        
    }
     // event is coming from the event listener 
    var ctrlDeleteItem = function(event)
    {
        var itemID,splitID,type,ID;
        // itemID='inc-1'
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID)
        {
            //inc-1  : primitives can have access to methods but before they need to be wrapped by js to transform them to objects
            splitID=itemID.split('-');
         
            // return an array  ["inc", "1"];
            type = splitID[0];
            ID = parseInt(splitID[1]);
            // 1.delete the item from the data structure 
            budgetCtrl.deleteItem(type,ID);
            //2. Delete the item from the UI  
            //var itemIdTag=".".concat(itemID);
            UICtrl.deleteListItem(itemID);
            //3.update and show the new budget 
            updateBudget();
            // 4.calulate and update percentages 
            updatePercentages();

        }
    }



    return {
        // clean Code 
        init:function()
        {
            console.log('Application has Started !');
            // clear All the Data
            UIController.displayBudget({
                                        budget :0,
                                        totalInc:0,
                                        totalExp:0,
                                        percentage:-1
                                            });

            // Set the current Date 
            UIController.displayMonth();
            setupEventListeners();
        }
    }
    
   

})(budgetController,UIController);




controller.init();