var default_param={
  new_born:true,
  max_level:4,
  decay:0.7,
  node:{
    count:[0,0,0],
    children:Array(9)
  }
};
var param=default_param;
var bot= {
  init: function(_param,data){
  },
  getHand:function()
  {
    if(this._private.history[0]===undefined){
      return (Math.random()*3)|0;
    }
    //update predict
    //return standard diviation
    var get_score=function(count){
      var sum1=0;
      var sum2=0;
      for(var i=0;i<3;i++){
        sum1+=count[i];
        sum2+=count[i]*count[i];
      }
      return (sum2/3-sum1*sum1/9)/(sum1/3);
    };
    node=this._private.node;
    var best_count=node.count;
    var best_score=get_score(best_count);
    var his=this._private.history;
    for(i=0;his[i]!==undefined;i++){
      var hisir=this._private.relativeHistory(his[i]);
      if(node.children[hisir]===undefined){
        node.children[hisir]=this._private.createNode(node);
        //no need to analyze deeper nodes
        break;
      }
      node=node.children[hisir];
      var score=get_score(node.count);
      if(score>best_score){
        best_score=score;
        best_count=node.count;
      }
    }
    var maxi=-1;
    var fr=function(count){
      var max=0;
      for(var i=0;i<3;i++){
        if(count[i]>max){
          max=count[i];
          maxi=i;
        }
      }
      return (maxi+1)%3;
    }(best_count);
    return (fr+this._private.h_last)%3;
  },
  update:function(h1,h0,dt)
  {
    //relative to last hand
    h0r=(h0-this._private.h_last+3)%3;
    h1r=(h1-this._private.h_last+3)%3;

    var his=this._private.history;

    //update count
    var node=this._private.node;
    this._private.updateCount(node.count,h0r);
    var tmp;
    for(var i=0;his[i]!==undefined;i++)
    {
      tmp=this._private.relativeHistory(his[i]);
      //change history
      if(node.children[tmp]===undefined){
        node.children[tmp]=this._private.createNode(node);
      }
      node=node.children[tmp];
      this._private.updateCount(node.count,h0r);
    }

    //update history
    for(i=param.max_level-2;i>=0;i--)
    {
      his[i+1]=his[i];
    }
    his[0]=h1*3+h0;

    //update h_last
    this._private.h_last=h0;

  },
  _private:
  {
    h_last:0,
    //his[i]=c_hum * 3 + c_bot relative to his[i+1]
    history:Array(param.max_level),
    node:param.node,
    createNode:function(_parent){
      var tmp=Array(3);
      for(var i=0;i<3;i++){
        //tmp[i]=_parent.count[i]*param.decay;
        tmp[i]=0;
      }
      return {
        count:tmp,
        children:Array(9)
      };
    },
    //decay, then add 1 to count[h0]
    updateCount:function(count,h0r){
      for(var i=0;i<3;i++){
        count[i]*=param.decay;
      }
      count[h0r]+=1;
    },
    relativeHistory:function(hisi){
      return ((((hisi/3)|0)-this.h_last+3)%3)*3+((hisi-this.h_last+3)%3);
    }
  }
};
self.onmessage=function(e){

  var token=e.data[0];
  var name=e.data[1];
  var args=e.data.slice(2);
  var rtn=bot[name].apply(bot,args);
  if(rtn===undefined){rtn="undefined";}
  self.postMessage({token:token,rtn:rtn});
};
