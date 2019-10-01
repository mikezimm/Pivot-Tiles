//Utils Concept from:  https://stackoverflow.com/questions/32790311/how-to-structure-utility-class

export default class Utils {
    static doSomething(val: string) { return val; }
    static doSomethingElse(val: string) { return val; }

    
  static convertCategoryToIndex(cat: string) {
    //https://stackoverflow.com/questions/6555182/remove-all-special-characters-except-space-from-a-string-using-javascript
    //string = string.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    if (cat){
      return (cat.replace(" ",'_').replace(/[&]/,'And').replace(/[*]/,'aamp').replace(/[\/\\#,+()$~%.'":*?<>{}]/g,''));
    } else {
      return ("");
    }

  }
}