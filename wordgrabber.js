Words = new Meteor.Collection("words");

// var wordData = [
//                 {word:"loquaicious"},
//                 {word:"bollocks"},
//                 {word:"heynow"},
//                 {word:"pill jar"},
//                 {word:"pellegrine"}
//                ];

// if (Words.find().count() ===  0){
//   _.each(wordData, function(item){
//     item.count = Words.find().count();
//     Words.insert(item);
//   });
// }


if (Meteor.isClient) {

Session.set('annotate', false);

//  ***|   MAIN WRAPPER   |*********
//  **************|   EVENTS   |*********
Template.mainWrapper.events({
  'keypress input#word_input': function(evt, template){
     if(evt.which === 13){
      this.date = new Date();
      var inputWord = template.find("#word_input").value;
      Session.set("spotlightWord", inputWord);
      Words.insert({ Definition: [], Examples: [], date:this.date, word:inputWord });
      template.find("#word_input").value = "";
     }
  }
});

//  ***|   MAIN WRAPPER  |*********
//  **************|   HELPERS   |********* 
    Template.mainWrapper.helpers({
    currentWord: function(){
      return Session.get('spotlightWord');
    }   
  });



//  ******|   TAB CONTENT |*********
//  *************|   EVENTS   |*****   
Template.tabContent.events({
  'click .annotation_buttons': function(e){
    if(Session.equals('annotate', false)){
      Session.set("annotate", true); 
      var annotateMode = $(e.target).text();
      Session.set('annotateMode', annotateMode);
    }else{
      Session.set('annotate', false);
    }
    
  }
});

//  ***|   TAB CONTENT |*********
//  ******************|   HELPERS   |********* 
Template.tabContent.helpers({
  annotate: function(){
    return Session.get("annotate");
  }
});


//  ***|   LIST HOLDER  ITEM |*********
//  ******************|   EVENTS   |********* 
Template.listHolderItem.events({
  'click .listHolderItem': function(template){
    Session.set("spotlightWord", this.word);
  }
});

 
//  ***|   LIST HOLDER   |*********
//  **************|   HELPERS   |********* 
  Template.listHolder.helpers({
    words: function(){
      return Words.find({},{sort: [["date","desc"]]});
    }    
  });

  Template.listHolderItem.helpers({
    capitalized: function(){
      var theWord = this.word;
      return theWord.toUpperCase();
    }
  });

//  ******|   ANNOTATOR |*********
//  ************|   EVENTS   |****
Template.annotator.events({
  'click #saveTextBox': function(e, template){
    e.preventDefault();
    var currentWord = Session.get('spotlightWord');
    var annotateMode = Session.get('annotateMode');
    var annotateInput = template.find("#ex_textbox").value;
    var currentObj = Words.findOne({'word': currentWord});
    (currentObj[annotateMode]).push(annotateInput);   
    console.log(currentObj[annotateMode])
    template.find("#ex_textbox").value = "";  
    Session.set('annotate', 'false');
  
  }
});


}// is Client

if (Meteor.isServer) {
  Meteor.startup(function () {
  });
}// is Server
