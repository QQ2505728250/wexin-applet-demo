import emitter from './EventEmitter';
const Event = new emitter();

export default class Utility {

  constructor() {

  }

  /**
   * 常量
   * 
   * @static
   * 
   * @memberOf Utility
   */
  static $ConstItem() {
    return {
      Route: 'GOCOM_Router',
      Location: 'GOCOM_Location',
      AppIsGoBack: 'GOCOM_APP_IS_GO_BACK',
      BrowerTitle: 'GOCOM_BrowerTitle',
      Event: 'GOCOM_EVENT_INFO',
      UserInfo: 'GOCOM_USER_INFO',
      QueryParams: 'GOCOM_QUERY_PARAMS',
      UrlPathInfo: 'GOCOM_URL_PATH_INFO',

      Events: {
        HttpStatus: {
          400: 'GOCOM_HTTP_STATUS_400',
          401: 'GOCOM_HTTP_STATUS_401',
          402: 'GOCOM_HTTP_STATUS_402',
          403: 'GOCOM_HTTP_STATUS_403',
          404: 'GOCOM_HTTP_STATUS_404',
          405: 'GOCOM_HTTP_STATUS_405',
          500: 'GOCOM_HTTP_STATUS_500',
          501: 'GOCOM_HTTP_STATUS_501',
        },
        ShowModel: {
          onActionSheet: 'GOCOM_MODEL_ACTION_SHEET',
          onActionSheetHide: 'GOCOM_MODEL_ACTION_SHEET_HIDE',
          onLoading: 'GOCOM_MODEL_LOADING',
          onLoadingHide: 'GOCOM_MODEL_LOADING_HIDE',
          onDialog: 'GOCOM_MODEL_DIALOG',
          onDialogHide: 'GOCOM_MODEL_DIALOG_HIDE',
        }
      },
      UrlItem: {
        GoBack: 'GOCOM_GOBACK',
        Home: '/pages/index/index',
        Test: '/pages/test/test',
        Login: '/pages/login/login',
      }
    }
  };

  static $Emit(name, args) {
    Event.emit(name, args);
  }

  static $On(name, callback) {
    Event.on(name, callback);
  }

  static $ToPage(url, params) {
    if (!url || !wx) {
      return;
    }
    const _p = this.$ConvertToUrlParams(params);
    let __url = url;
    if (_p && _p !== '') {
      __url += '/?' + _p;
    }
    wx.navigateTo({ url: __url });
    // wx.redirectTo({ url: __url });
  }

  /**
    * 将一个 对象转成url参数与&分开
    *
    * @param params 参数对象
    * @param split 分割符
    * @returns {*}
    * @example {a:a,b:b,c:c,e:e}
    * a=a&b=b&c=c&e=e
    */
  static $ConvertToUrlParams(params, options) {
    const { split, notFields } = options || {};
    if (!params || params === null) {
      return null;
    }
    const __KeyValue = [];
    const self = this;
    const __JSONValue = (value) => {
      try {
        let __JValue;
        if (value === null) {
          return '';
        }
        const { constructor } = value;
        if (typeof constructor === 'undefined' || constructor === null) {
          return '';
        }
        switch (value.constructor.name) {
          case 'Object':
            __JValue = '{' + this.convertToUrlParams(value) + '}';
            break;
          case 'Array':
            __JValue = JSON.stringify(value);
            break;
          default:
            __JValue = value;
        }
        return __JValue;
      } catch (ex) {
        console.log(ex.message);
        return value || '';
      }
    };
    Object.keys(params).forEach((key) => {
      const __value = params[key];
      if (__value && __value !== '') {
        if (key.toLowerCase() !== 'IsExistsNextData'.toLowerCase()) {
          const _JValue = __JSONValue(__value);
          if (notFields) {
            if (notFields.indexOf(key) === -1) {
              __KeyValue.push(key + '=' + _JValue);
            }
          } else {
            __KeyValue.push(key + '=' + _JValue);
          }
        }
      }
    });
    return __KeyValue.join(split ? split : '&');
  }

  static $ParseData(target, ReturnData) {
    if (!target) {
      target = {};
      target.List = List;
      target.Condition = Condition;
      return;
    }
    const { Condition, List } = ReturnData;
    if (Condition.PageIndex === 1) {
      target.List = List;
      target.Condition = Condition;
      return;
    }
    if (!this.$IsArray(target.List)) {
      target.List = [];
    }
    target.List = target.List.concat(List);
    target.Condition = Condition;
  }

  static $IsArray(arg) {
    if (!arg || !arg.length || arg.length === 0) {
      return false;
    }
    return arg.constructor.name === 'Array';
  }

  static $SetContent(key, value, isSaveStore) {
    if (!this.__TempContent) {
      this.__TempContent = {};
    }
    this.__TempContent[key] = value;
    if (!!isSaveStore) {
      try {
        wx.setStorageSync(key, JSON.stringify(value));
      } catch (ex) {
        console.log(ex);
      }
    }
  }

  static $GetContent(key) {
    let __value = this.__TempContent ? this.__TempContent[key] : null;
    if (!__value) {
      try {
        __value = wx.getStorageSync(key);
        __value = JSON.parse(__value);
        this.__TempContent[key] = __value;
      }
      catch (ex) {
        console.log(ex);
      }
    }
    return __value;
  }

  static $RemoveContent(key) {
    if (this.__TempContent && this.__TempContent[key]) {
      delete this.__TempContent[key];
    }
    try {
      wx.removeStorageSync(key);
    } catch (ex) {
      console.log(ex);
    }
  }

}