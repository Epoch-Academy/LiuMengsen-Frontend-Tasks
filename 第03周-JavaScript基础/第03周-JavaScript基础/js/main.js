// 原始脏数据
const rawMembers = [
  { id: 'm01', name: '张一',   grade: '大一', direction: '前端', score: 85,      submitted: true  },
  { id: 'm02', name: '   ',    grade: '大二', direction: '后端', score: ' 85 ',  submitted: true  },
  { id: 'm03', name: '李三',   grade: '大三', direction: '前端', score: 105,     submitted: true  },
  { id: 'm04', name: '王四',   grade: '大一', direction: '前端', score: 92                        },
  { id: 'm05', name: '赵五',   grade: '大二', direction: '后端', score: 'abc',   submitted: true  },
  { id: 'm06', name: '钱六',   grade: '大一', direction: '算法', score: ' 78 ', submitted: false },
  { id: 'm07', name: '孙七',   grade: '大四', direction: '   ', score: 88,      submitted: true  },
  { id: 'm08', name: '周八',   grade: '大二', direction: '前端', score: 59.4,    submitted: true  },
  { id: 'm09', name: '吴九',   grade: '大三', direction: '后端', score: 95,      submitted: true  },
  { id: 'm10', name: '郑十',   grade: '大一', direction: '算法', score: 95,      submitted: false },
  { id: 'm11', name: '王十一', grade: '大二', direction: '前端', score: 90,      submitted: true  },
  { id: 'm12', name: ' 冯十二 ', grade: '大一', direction: '后端', score: 0,      submitted: false },
  { id: 'm13', name: '陈十三', grade: '大三', direction: '算法', score: 100,     submitted: true  },
  { id: 'm14', name: '褚十四', grade: '大二', direction: '前端', score: 61,      submitted: true  },
  { id: 'm06', name: '卫十五', grade: '大一', direction: '后端', score: 88,      submitted: true  },
  { id: 'm16', name: '蒋十六', grade: '大四', direction: '算法', score: ' 95 ',  submitted: true  }
]

// 常量
const SCORE_MIN = 0;
const SCORE_MAX = 100;
const ADMIT_HIGH = 80;
const ADMIT_MID = 60;

// 清洗函数
function cleanMembers(rawList) {
  const members = [];
  const issues = [];
  const seenId = new Set();

  for (const rawItem of rawList) {
    const item = {...rawItem};
    let isDrop = false;

    // 姓名
    const oriName = item.name ?? "";
    item.name = oriName.trim();
    if(oriName !== item.name){
      issues.push(`- 修复 ${item.id}: 姓名 "${oriName}" -> "${item.name}"（去掉首尾空格）`)
    }
    if(item.name === ""){
      issues.push(`- 丢弃 ${item.id}：姓名为空`)
      isDrop = true;
    }

    // 方向
    if(!isDrop){
      const oriDir = item.direction ?? "";
      item.direction = oriDir.trim();
      if(oriDir !== item.direction){
        issues.push(`- 修复 ${item.id}: 方向去除首尾空格`)
      }
      if(item.direction === ""){
        issues.push(`- 丢弃 ${item.id}：方向为空`)
        isDrop = true;
      }
    }

    // submitted
    if(!isDrop){
      if(typeof item.submitted !== "boolean"){
        issues.push(`- 修复 ${item.id}: 缺少 submitted，按未提交处理，补为 false`)
        item.submitted = false;
      }
    }

    // 分数
    if(!isDrop){
      const scoreStr = String(item.score ?? "").trim();
      const scoreNum = Number(scoreStr);
      if(!isNaN(scoreNum) && scoreNum >= SCORE_MIN && scoreNum <= SCORE_MAX){
        if(typeof item.score !== "number"){
          issues.push(`- 修复 ${item.id}: 成绩 '${item.score}' -> ${scoreNum}（字符串转数字）`)
        }
        item.score = scoreNum;
      }else{
        issues.push(`- 丢弃 ${item.id}：成绩非法（${item.score}）`)
        isDrop = true;
      }
    }

    // 重复id
    if(!isDrop){
      if(seenId.has(item.id)){
        issues.push(`- 丢弃 ${item.id}：id 重复，保留第一条`)
        isDrop = true;
      }else{
        seenId.add(item.id);
      }
    }

    if(!isDrop){
      members.push(item);
    }

  }
  return {members, issues};
}

// 调用清洗
const {members:cleanedList, issues:logList} = cleanMembers(rawMembers);

// 1. 平均分
const sumScore = cleanedList.reduce((sum, item) => sum + item.score, 0);
const avgScore = (sumScore / cleanedList.length).toFixed(1);

// 2. 各方向人数统计
const dirMap = {};
for(const item of cleanedList){
  if(dirMap[item.direction]){
    dirMap[item.direction] ++;
  }else{
    dirMap[item.direction] = 1;
  }
}
const dirStat = Object.entries(dirMap).map(([direction, count])=>({direction,count}));

// 3. 按分数从高到低排序
const scoreRank = [...cleanedList].sort((a,b)=> b.score - a.score).map(x=>({name:x.name, score:x.score}));

// 4. 最高分
const maxScore = Math.max(...cleanedList.map(x=>x.score));

console.log(`原始数据 ${rawMembers.length} 条，清洗后有效 ${cleanedList.length} 条`);
console.log(`平均成绩：${avgScore}`);
console.log("各方向统计：");
console.log(dirStat);
console.log("排名：");
console.log(scoreRank);
console.log(`最高分：${maxScore}`);

// 原来的日志打印，保留
console.log("====问题日志====")
for(const msg of logList){
  console.log(msg)
}
console.log("====清洗完成后的有效数据====")
console.log(JSON.stringify(cleanedList,null,2));
const rawCount = rawMembers.length;
const validCount = cleanedList.length;
const fixCount = logList.filter(s=>s.includes("修复")).length;
const dropCount = logList.filter(s=>s.includes("丢弃")).length;
console.log(`原始数据 ${rawCount} 条，清洗后有效 ${validCount} 条，共发现 ${logList.length} 处问题（修复 ${fixCount} 处，丢弃 ${dropCount} 处）。`)

function findMemberById(list, id) {
  for (const item of list) {
    if (item.id === id) {
      return item;
    }
  }
  return null;
}
const target = findMemberById(cleanedList, "m06");
console.log("\n==== 根据id查找m06结果 ====");
console.log(target);