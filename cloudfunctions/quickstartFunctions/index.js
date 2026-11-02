const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
// 获取openid
const getOpenId = async () => {
  // 获取基础信息
  const wxContext = cloud.getWXContext();
  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  };
};

// 获取小程序二维码
const getMiniProgramCode = async () => {
  // 获取小程序二维码的buffer
  const resp = await cloud.openapi.wxacode.get({
    path: "pages/index/index",
  });
  const { buffer } = resp;
  // 将图片上传云存储空间
  const upload = await cloud.uploadFile({
    cloudPath: "code.png",
    fileContent: buffer,
  });
  return upload.fileID;
};

// 创建集合
const createCollection = async () => {
  try {
    // 创建集合
    await db.createCollection("sales");
    await db.collection("sales").add({
      // data 字段表示需新增的 JSON 数据
      data: {
        region: "华东",
        city: "上海",
        sales: 11,
      },
    });
    await db.collection("sales").add({
      // data 字段表示需新增的 JSON 数据
      data: {
        region: "华东",
        city: "南京",
        sales: 11,
      },
    });
    await db.collection("sales").add({
      // data 字段表示需新增的 JSON 数据
      data: {
        region: "华南",
        city: "广州",
        sales: 22,
      },
    });
    await db.collection("sales").add({
      // data 字段表示需新增的 JSON 数据
      data: {
        region: "华南",
        city: "深圳",
        sales: 22,
      },
    });
    return {
      success: true,
    };
  } catch (e) {
    // 这里catch到的是该collection已经存在，从业务逻辑上来说是运行成功的，所以catch返回success给前端，避免工具在前端抛出异常
    return {
      success: true,
      data: "create collection success",
    };
  }
};

// 查询数据
const selectRecord = async () => {
  // 返回数据库查询结果
  return await db.collection("sales").get();
};

// 更新数据
const updateRecord = async (event) => {
  try {
    // 遍历修改数据库信息
    for (let i = 0; i < event.data.length; i++) {
      await db
        .collection("sales")
        .where({
          _id: event.data[i]._id,
        })
        .update({
          data: {
            sales: event.data[i].sales,
          },
        });
    }
    return {
      success: true,
      data: event.data,
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e,
    };
  }
};

// 新增数据
const insertRecord = async (event) => {
  try {
    const insertRecord = event.data;
    // 插入数据
    await db.collection("sales").add({
      data: {
        region: insertRecord.region,
        city: insertRecord.city,
        sales: Number(insertRecord.sales),
      },
    });
    return {
      success: true,
      data: event.data,
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e,
    };
  }
};

// 删除数据
const deleteRecord = async (event) => {
  try {
    await db
      .collection("sales")
      .where({
        _id: event.data._id,
      })
      .remove();
    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e,
    };
  }
};

// 试听机构业务数据：客户端只调用云函数，避免直接暴露数据库写权限。
const getAppointments = async () => {
  try {
    const result = await db.collection("appointments").orderBy("createdAt", "desc").limit(100).get();
    return { success: true, data: result.data.map(formatAppointment) };
  } catch (err) {
    // 新环境还未创建集合时保持可用，前端会展示本地演示数据。
    return { success: false, errMsg: err.message };
  }
};

const formatAppointment = (item) => ({
  ...item,
  id: item._id,
  date: item.date || "待定",
  statusText: item.statusText || "待确认",
  statusClass: item.statusClass || "orange",
});

const createAppointment = async (event) => {
  const appointment = event.appointment || {};
  if (!appointment.student || !appointment.course || !appointment.time) {
    return { success: false, errMsg: "缺少预约必要信息" };
  }
  const { OPENID } = cloud.getWXContext();
  const result = await db.collection("appointments").add({
    data: {
      student: appointment.student,
      age: Number(appointment.age) || 0,
      phone: appointment.phone || "",
      course: appointment.course,
      date: appointment.date || "待定",
      time: appointment.time,
      teacher: appointment.teacher || "待分配",
      statusText: "待确认",
      statusClass: "orange",
      createdBy: OPENID,
      createdAt: db.serverDate(),
      updatedAt: db.serverDate(),
    },
  });
  return { success: true, data: { id: result._id } };
};

const updateAppointment = async (event) => {
  if (!event.id || !event.statusText) return { success: false, errMsg: "缺少更新参数" };
  const statusClass = { "待确认": "orange", "已确认": "blue", "已到店": "green", "已完成": "gray" }[event.statusText] || "gray";
  await db.collection("appointments").doc(event.id).update({
    data: { statusText: event.statusText, statusClass, updatedAt: db.serverDate() },
  });
  return { success: true };
};

const getDashboard = async () => {
  const appointments = await getAppointments();
  if (!appointments.success) return appointments;
  const list = appointments.data;
  const checked = list.filter((item) => item.statusText === "已到店").length;
  const finished = list.filter((item) => item.statusText === "已完成").length;
  return {
    success: true,
    data: {
      appointments: list.slice(0, 5),
      stats: {
        today: list.length,
        waiting: list.filter((item) => item.statusText === "待确认").length,
        checked,
        rate: checked + finished ? Math.round((finished / (checked + finished)) * 100) : 0,
      },
    },
  };
};

// const getOpenId = require('./getOpenId/index');
// const getMiniProgramCode = require('./getMiniProgramCode/index');
// const createCollection = require('./createCollection/index');
// const selectRecord = require('./selectRecord/index');
// const updateRecord = require('./updateRecord/index');
// const fetchGoodsList = require('./fetchGoodsList/index');
// const genMpQrcode = require('./genMpQrcode/index');
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case "getOpenId":
      return await getOpenId();
    case "getMiniProgramCode":
      return await getMiniProgramCode();
    case "createCollection":
      return await createCollection();
    case "selectRecord":
      return await selectRecord();
    case "updateRecord":
      return await updateRecord(event);
    case "insertRecord":
      return await insertRecord(event);
    case "deleteRecord":
      return await deleteRecord(event);
    case "getAppointments":
      return await getAppointments();
    case "createAppointment":
      return await createAppointment(event);
    case "updateAppointment":
      return await updateAppointment(event);
    case "getDashboard":
      return await getDashboard();
  }
};
