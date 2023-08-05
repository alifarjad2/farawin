//فایل کمکی برای پروژه بوت کمپ فراوین

/**
 * Usefull function to interact with external api for project
 * this function use fetch
 * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 *
 * api doc url : https://farawin.iran.liara.run/doc
 *
 * @param {'GET'| 'POST'| 'PUT'| 'DELETE'} methodType - http type of method
 * @param {string} address - address of endpoint user/login
 * @param {object} [sendData] - send data json for api (JUST DONT NEED IN GET)
 * @param {string} [token] - token if api need it (JUST DONT NEED IN USER API's)
 * @return {{code: string, message: string}}
 *
 * @example
 *
 *
 *   fetchFromApi("POST", "user/login", {
 *      username: "09000000000",
 *      password: "xxxxxxxx",
 *   });
 */
async function fetchFromApi(methodType, address, sendData, token) {
  if (!methodType) throw "methodType reqiured";
  if (!address) throw "address reqiured";
  methodType = methodType.toLocaleUpperCase();

  if (methodType !== "GET" && !sendData)
    throw `sendData reqiured for ${methodType} method`;

  token = token || localStorage.token;
  if (!address.toLocaleLowerCase().startsWith("user") && !token)
    throw `this endpoint need token to work!`;

  let result = null;
  let body = null;

  if (methodType !== "GET") {
    try {
      body = JSON.stringify(sendData);
      if (Object.values(sendData).find((v) => typeof v === "object"))
        throw "ورودی غیر مجاز است!";
    } catch {
      result = {
        code: -3,
        message: "پارامتر های ورودی به تابعتون درست نیست!",
      };
      return result;
    }
  }

  try {
    result = await fetch("https://farawin.iran.liara.run/api/" + address, {
      headers: token && {
        Authorization: "bearer " + token,
      },
      body: body,
      method: methodType,
    }).then((res) => res.json());
  } catch (e) {
    result = {
      code: -1,
      message: "خطایی از سمت سرور برخورده است!",
      exception: e,
    };

    if (!window.navigator.onLine) {
      result = {
        code: -2,
        message:
          "عدم دستیابی به سرور،‌ممکن است اینترنت شما مشکلی برخورده باشه.",
      };
    }
  }

  return result;
}

/**
 * set of tools from farawin mentor for beginers
 * set as Global for learning
 *  * @example
 *   window.farawin
 */

const farawin = {
  /**
   *  یک تابع بفرستید تا جواب گرفته شده رو بررسی کنید و پیغام نمایش بدید
   * مثل تابع هایی که برای ایونت ها می فرستید
   * مثلا
   * onclick = ()=>{}
   *
   * @callback responseHandlerCallback
   * @param {{code: string, message: string}} response
   */

  /**
   *  تابعی برای تست دریافت چت ها
   * @param {responseHandlerCallback} responseHandlerCallback - یک تابع بفرستید تا جواب گرفته شده رو بررسی کنید و پیغام نمایش بدید
   *
   * @example
   *  farawin.getChats(result => console.table(result.chatList))
   *
   */
  getChats: async (responseHandlerCallback) => {
    const result = await farawin.fetch("GET", "chat");
    responseHandlerCallback && responseHandlerCallback(result);
    return result;
  },

  /**
   *  تابعی برای تست دریافت چت های یک مخاطب
   * @param {string} username - موبایل مخاطب برای دریاف چت‌ها
   * @param {responseHandlerCallback} responseHandlerCallback - یک تابع بفرستید تا جواب گرفته شده رو بررسی کنید و پیغام نمایش بدید
   *
   * @example
   *  farawin.getContactChats('09123456789', result => console.table(result.chatList))
   *
   */
  getContactChats: async (username, responseHandlerCallback) => {
    const result = await farawin.fetch("GET", "chat/" + username);
    responseHandlerCallback && responseHandlerCallback(result);
    return result;
  },

  /**
   *  تابعی برای تست افزودن چت
   * @param {string} toUsername - موبایل مخاطب برای ارسال چت
   * @param {string} text - پیام حداقل ۱ حرف
   * @param {responseHandlerCallback} responseHandlerCallback - یک تابع بفرستید تا جواب گرفته شده رو بررسی کنید و پیغام نمایش بدید
   */
  testAddChat: async (toUsername, text, responseHandlerCallback) => {
    const result = await fetchFromApi("POST", "chat", {
      contactUsername: toUsername,
      textHtml: text,
    });

    responseHandlerCallback && responseHandlerCallback(result);
    return result;
  },

  /**
   *  تابعی برای تست ویرایش چت
   * @param {string} toUsername - موبایل مخاطب برای ویرایش چت
   * @param {string} text - پیام حداقل ۱ حرف
   * @param {responseHandlerCallback} responseHandlerCallback - یک تابع بفرستید تا جواب گرفته شده رو بررسی کنید و پیغام نمایش بدید
   */
  testEditChat: async (toUsername, text, responseHandlerCallback) => {
    const result = await fetchFromApi("POST", "chat", {
      contactUsername: toUsername,
      textHtml: text,
    });

    responseHandlerCallback && responseHandlerCallback(result);
    return result;
  },

  /**
   *  تابعی برای تست حذف چت
   * @param {number} id -آیدی پیام برای حذف
   * @param {responseHandlerCallback} responseHandlerCallback - یک تابع بفرستید تا جواب گرفته شده رو بررسی کنید و پیغام نمایش بدید
   */
  testDeleteChat: async (id, responseHandlerCallback) => {
    const result = await fetchFromApi("POST", "chat", {
      id,
    });

    responseHandlerCallback && responseHandlerCallback(result);
    return result;
  },

  /**
   *  تابعی برای تست افزودن مخاطب
   * @param {string} username - موبایل گرفته شده از کاربر اعتبار سنجی یادتون نره
   * @param {string} name - نام حداقل ۳ حرف
   * @param {responseHandlerCallback} responseHandlerCallback - یک تابع بفرستید تا جواب گرفته شده رو بررسی کنید و پیغام نمایش بدید
   */
  testAddContact: async (username, name, responseHandlerCallback) => {
    const result = await fetchFromApi("POST", "contact", {
      username,
      name,
    });

    responseHandlerCallback && responseHandlerCallback(result);
    return result;
  },

  /**
   *  تابعی برای تست ویرایش مخاطب
   * @param {string} username - موبایل گرفته شده از کاربر اعتبار سنجی یادتون نره
   * @param {string} name - نام حداقل ۳ حرف
   * @param {responseHandlerCallback} responseHandlerCallback - یک تابع بفرستید تا جواب گرفته شده رو بررسی کنید و پیغام نمایش بدید
   */
  testEditContact: async (username, name, responseHandlerCallback) => {
    const result = await fetchFromApi("PUT", "contact", {
      username,
      name,
    });

    responseHandlerCallback && responseHandlerCallback(result);
    return result;
  },

  /**
   *  تابعی برای تست حذف مخاطب
   * @param {string} username - موبایل گرفته شده از کاربر اعتبار سنجی یادتون نره
   * @param {responseHandlerCallback} responseHandlerCallback - یک تابع بفرستید تا جواب گرفته شده رو بررسی کنید و پیغام نمایش بدید
   */
  testDeleteContact: async (username, responseHandlerCallback) => {
    const result = await fetchFromApi("DELETE", "contact", {
      username,
    });

    responseHandlerCallback && responseHandlerCallback(result);
    return result;
  },

  /**
   *  تابعی برای تست لاگین
   * کافیه یوزر و پسورد گرفته شده از کاربر رو به این تابع ارسال کنید
   * خودش براتون می فرسته به سرور و جواب رو بر می گردونه
   *  اگر کد برگردونده شده ۲۰۰ نباشد یک جای کار می لنگه و به احتمال زیاد با اعتبار سنجی بر می گرده
   * @param {string} username - موبایل گرفته شده از کاربر اعتبار سنجی یادتون نره
   * @param {string} password - پسورد گرفته شده از کاربر
   * @param {responseHandlerCallback} responseHandlerCallback - یک تابع بفرستید تا جواب گرفته شده رو بررسی کنید و پیغام نمایش بدید
   *
   * @example
   *
   *
   *     //if your button is stop form default submit form
   *     //event.preventDefault();
   *
   *   farawin.testLogin(
   *     "موبایل گرفته شده از کاربر",
   *     "پسورد گرفته شده از کاربر",
   *     (response) => {
   *       //response is object like {code: string, message: string}
   *       //if code is '200' mean success
   *       //else mean error!
   *       //Goodluck:)
   *
   *       const success = response.code == "200";
   *
   *       if (success) console.log("result from api -> ", response);
   *       else console.error("error from api -> ", response);
   *
   *       //you response to get message
   *       //like
   *       alert(response.message);
   *
   *       //redirect if you want
   *       // if(success)
   *       //   window.location.assign('url...')
   *     }
   *   );
   *
   */
  testLogin: async (username, password, responseHandlerCallback) => {
    const result = await fetchFromApi("POST", "user/login", {
      username,
      password,
    });

    //save token
    if (result.token) localStorage.token = result.token;

    responseHandlerCallback && responseHandlerCallback(result);
    return result;
  },

  /**
   *  تابعی برای تست دریافت مخاطبین
   * @param {responseHandlerCallback} responseHandlerCallback - یک تابع بفرستید تا جواب گرفته شده رو بررسی کنید و پیغام نمایش بدید
   *
   * @example
   *  farawin.getContacts(res=> console.log(res))
   *
   */
  getContacts: async (responseHandlerCallback) => {
    const result = await farawin.fetch("GET", "contact");
    responseHandlerCallback && responseHandlerCallback(result);
    return result;
  },

  /**
   *  تابعی برای تست دریافت یوزرها
   * @param {responseHandlerCallback} responseHandlerCallback - یک تابع بفرستید تا جواب گرفته شده رو بررسی کنید و پیغام نمایش بدید
   *
   * @example
   *  farawin.getUsers(res=> console.log(res))
   *
   */
  getUsers: async (responseHandlerCallback) => {
    const result = await farawin.fetch("GET", "user");
    responseHandlerCallback && responseHandlerCallback(result);
    return result;
  },

  /**
   *  تابعی برای تست رجیستر یا ثبت‌نام
   * کافیه یوزر و پسورد گرفته شده از کاربر رو به این تابع ارسال کنید
   * خودش براتون می فرسته به سرور و جواب رو بر می گردونه
   *  اگر کد برگردونده شده ۲۰۰ نباشد یک جای کار می لنگه و به احتمال زیاد با اعتبار سنجی بر می گرده
   * @param {string} username - موبایل گرفته شده از کاربر اعتبار سنجی یادتون نره
   * @param {string} password - پسورد گرفته شده از کاربر
   * @param {string} name - نام گرفته شده از کاربر
   * @param {responseHandlerCallback} responseHandlerCallback - یک تابع بفرستید تا جواب گرفته شده رو بررسی کنید و پیغام نمایش بدید
   *
   * @example
   *
   *
   *     //if your button is stop form default submit form
   *     //event.preventDefault();
   *
   *   farawin.testRegister(
   *     "موبایل گرفته شده از کاربر",
   *     "پسورد گرفته شده از کاربر",
   *     "نام گرفته شده از کاربر",
   *     (response) => {
   *       //response is object like {code: string, message: string}
   *       //if code is '200' mean success
   *       //else mean error!
   *       //Goodluck:)
   *
   *       const success = response.code == "200";
   *
   *       if (success) console.log("result from api -> ", response);
   *       else console.error("error from api -> ", response);
   *
   *       //you response to get message
   *       //like
   *       alert(response.message);
   *
   *       //redirect if you want
   *       // if(success)
   *       //   window.location.assign('url...')
   *     }
   *   );
   *
   */
  testRegister: async (username, password, name, responseHandlerCallback) => {
    const result = await fetchFromApi("POST", "user", {
      username,
      password,
      name: name || "farawin",
    });

    responseHandlerCallback && responseHandlerCallback(result);
    return result;
  },

  //just for example
  example: () => {
    //if your button is stop form default submit form
    //event.preventDefault();
    farawin.testRegister(
      "موبایل گرفته شده از کاربر",
      "پسورد گرفته شده از کاربر",
      "نام گرفته شده از کاربر",
      (response) => {
        //response is object like {code: string, message: string}
        //if code is '200' mean success
        //else mean error!
        //Goodluck:)

        const success = response.code == "200";

        if (success) console.log("result from api -> ", response);
        else console.error("error from api -> ", response);

        //you response to get message
        //like
        alert(response.message);

        //redirect if you want
        // if(success)
        //   window.location.assign('url...')
      }
    );
    farawin.testLogin2(),
      //if your button is stop form default submit form
      //event.preventDefault();
      farawin.testLogin(
        "موبایل گرفته شده از کاربر",
        "پسورد گرفته شده از کاربر",
        (response) => {
          //response is object like {code: string, message: string}
          //if code is '200' mean success
          //else mean error!
          //Goodluck:)

          const success = response.code == "200";

          if (success) console.log("result from api -> ", response);
          else console.error("error from api -> ", response);

          //you response to get message
          //like
          alert(response.message);

          //redirect if you want
          // if(success)
          //   window.location.assign('url...')
        }
      );
  },

  fetch: fetchFromApi,

  /**
   * رجکس برای بررسی صحت موبایل
   */

  mobileRegex: /^09([0-9]{9})$/,

  /**
   * تابع کمکی برای تبدیل اعداد فارسی به انگلیسی
   * @param {string} numberString رشته شامل ورودی از کاربر
   * @return {string} رشته بدون اعداد فارسی
   *
   */
  toEnDigit: function (numberString) {
    return (numberString + "" || "").replace(
      /[٠-٩۰-۹]/g, // Detect all Persian/Arabic Digit in range of their Unicode with a global RegEx character set
      function (a) {
        return a.charCodeAt(0) & 0xf;
      } // Remove the Unicode base(2) range that not match
    );
  },
};

if (typeof window !== "undefined") window.farawin = farawin;
module.exports = farawin;
