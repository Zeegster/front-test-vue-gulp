function getWeekNumber(date) {
  const firstDayOfTheYear = new Date(date.getFullYear(), 0, 1);
	const pastDaysOfYear = (date.getTime() - firstDayOfTheYear.getTime()) / 86400000;
	
	return Math.ceil((pastDaysOfYear + firstDayOfTheYear.getDay() + 1) / 7)
}

function isLeapYear(year) {
  return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
}

export class Day {
  constructor(date = null, lang = 'default') {
    date = date ?? new Date();

    this.DATE = date;
    this.date = date.getDate();
    this.day = date.toLocaleString(lang, { weekday: 'long' });
    this.dayUpCase =
      date.toLocaleString(lang, { weekday: 'long' }).charAt(0).toUpperCase() +
      date.toLocaleString(lang, { weekday: 'long' }).slice(1);
    this.dayShort = date.toLocaleString(lang, { weekday: 'short' });
    this.dayShortUpCase =
      date.toLocaleString(lang, { weekday: 'short' }).charAt(0).toUpperCase() +
      date.toLocaleString(lang, { weekday: 'short' }).slice(1);
    this.dayNumber = date.getDay();
    this.week = getWeekNumber(date);
    this.month = date.toLocaleString(lang, { month: 'long' });
    this.monthUpCase =
      date.toLocaleString(lang, { month: 'long' }).charAt(0).toUpperCase() +
      date.toLocaleString(lang, { month: 'long' }).slice(1);
    this.monthShort = date.toLocaleString(lang, { month: 'short' });
    this.monthShortUpCase =
      date.toLocaleString(lang, { month: 'short' }).charAt(0).toUpperCase() +
      date.toLocaleString(lang, { month: 'short' }).slice(1);
    this.monthNumber = Number(date.toLocaleString(lang, { month: 'numeric' }));
    this.year = date.getFullYear();
    this.yearShort = Number(date.toLocaleString(lang, { year: '2-digit' }));
    this.timestamp = date.getTime();
    this.dayFormat = this.format('DD MMMM YYYY');
  }
  
  get isToday() {
    return this.isEqualTo(new Date());
  }
  
  isEqualTo(date) {
    date = date instanceof Day ? date.Date : date;
    
    return date.getDate() === this.date &&
      date.getMonth() === this.monthNumber - 1 &&
      date.getFullYear() === this.year;
  }
  
  format(formatStr) {
    return formatStr
      .replace(/\bYYYY\b/, this.year)
      .replace(/\bYYY\b/, this.yearShort)
      .replace(/\bWW\b/, this.week.toString().padStart(2, '0'))
      .replace(/\bW\b/, this.week)
      .replace(/\bDDDD\b/, this.day)
      .replace(/\bDDD\b/, this.dayShort)
      .replace(/\bDD\b/, this.date.toString().padStart(2, '0'))
      .replace(/\bD\b/, this.date)
      .replace(/\bMMMM\b/, this.month)
      .replace(/\bMMM\b/, this.monthShort)
      .replace(/\bMM\b/, this.monthNumber.toString().padStart(2, '0'))
      .replace(/\bM\b/, this.monthNumber)
  }
}

export class Month {
  constructor(date = null, lang = 'default') {
    const day = new Day(date, lang);
    const monthsSize = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.lang = lang;
    
    this.name = day.month;
    this.nameUpCase = day.month.charAt(0).toUpperCase() + day.month.slice(1);
    this.number = day.monthNumber;
    this.year = day.year;
    this.numberOfDays = monthsSize[this.number - 1];

    if(this.number === 2) {
      this.numberOfDays += isLeapYear(day.year) ? 1 : 0;
    }
    
    this[Symbol.iterator] = function* () {
      let number = 1;
      yield this.getDay(number);
      while(number < this.numberOfDays) {
        ++number;
        yield this.getDay(number);
      }
    }
  }
  
  getDay(date) {
    return new Day(new Date(this.year, this.number - 1, date), this.lang);
  }

  
}

export class Calendar {
  weekDays = Array.from({length: 7});
  
  constructor(year = null, monthNumber = null, lang = 'default') {
    this.today = new Day(null, lang);
    this.year = year ?? this.today.year;
    this.month = new Month(new Date(this.year, (monthNumber || this.today.monthNumber) - 1), lang);
    this.totalMonths = Array.from({length: 12}).map((_, i) => new Month(new Date(this.year, i), lang).nameUpCase);
    this.totalYears = Array.from({length: 100}).map((_, i) => this.year - 50 + i);
    this.lang = lang;
    this.weeks = this.getWeeks();
    this.weekDaysShort = []
    this[Symbol.iterator] = function* () {
      let number = 1;
      yield this.getMonth(number);
      while(number < 12) {
        ++number;
        yield this.getMonth(number);
      }
    }
    
    this.weekDays.forEach((_, i) => {
      const day = this.month.getDay(i + 1);
      if(!this.weekDays.includes(day.day)) {
        this.weekDays[day.dayNumber] = day.day
      }
    })

    if(lang === 'ru') {
      this.weekDays = this.weekDays.filter((_, i) => i !== 0).concat(this.weekDays[0]);
      
    }

    this.weekDaysShort = this.weekDays.map((day) => {
      let cleanedDay = day;
      if(lang === 'ru') {
        cleanedDay = cleanedDay.replace(/[аеёеийоуэюя]/gi, '');
       return cleanedDay.charAt(0).toUpperCase() + cleanedDay.slice(1,2)
      }
      else {
       return cleanedDay.substring(0, 3);
      }

     
     });
     


  }
  
  get isLeapYear() {
    return isLeapYear(this.year);
  }
  getWeeks() {
    const firstDayOfMonth = this.month.getDay(1);
    const firstDayOfWeek = firstDayOfMonth.dayNumber;
    const totalDaysInMonth = this.month.numberOfDays;
    const totalDays = totalDaysInMonth + firstDayOfMonth.dayNumber - 1;
    const weeks = [];
   
    for (let i = 0; i < totalDays; i += 7) {
       const week = [];
       for (let j = 0; j < 7; j++) {
         const dayIndex = i + j - (firstDayOfMonth.dayNumber - 1 ) + 1;
         if (dayIndex > 0 && dayIndex <= totalDaysInMonth) {
           week.push(this.month.getDay(dayIndex));
         } else if (dayIndex <= 0) {
           week.push(this.getPreviousMonth().getDay(this.getPreviousMonth().numberOfDays + dayIndex));
         } else {
           week.push(this.getNextMonth().getDay(dayIndex - totalDaysInMonth));
         }
       }
       weeks.push(week);
    }
    
    return weeks ;
  }
   
  getMonth(monthNumber) {
    return new Month(new Date(this.year, monthNumber - 1), this.lang);
  }
  
  getPreviousMonth() {
    if(this.month.number === 1) {
      return new Month(new Date(this.year - 1, 11), this.lang);
    }
    
    return new Month(new Date(this.year, this.month.number - 2), this.lang);
  }
  
  getNextMonth() {
    if(this.month.number === 12) {
      return new Month(new Date(this.year + 1, 0), this.lang);
    }
    
    return new Month(new Date(this.year, this.month.number ), this.lang);
  }
  
  goToDate(monthNumber, year) {
    this.month = new Month(new Date(year, monthNumber - 1), this.lang);
    this.year = year;
  }
  
  goToNextYear() {
    this.year += 1;
    this.month = new Month(new Date(this.year, 0), this.lang);
  }
  
  goToPreviousYear() {
    this.year -= 1;
    this.month = new Month(new Date(this.year, 11), this.lang);
  }
  
  goToNextMonth() {
    if(this.month.number === 12) {
      return this.goToNextYear();
    }
    
    this.month = new Month(new Date(this.year, (this.month.number + 1) - 1), this.lang);
  }
  
  goToPreviousMonth() {
    if(this.month.number === 1) {
      return this.goToPreviousYear();
    }
    
    this.month = new Month(new Date(this.year, (this.month.number - 1) - 1), this.lang);
  }

  displayDays() {
    const firstDayofMonth = this.month.getDay(1);
    const totalLastMonthFinalDays = firstDayofMonth.dayNumber - 1;
    const totalDays = this.month.numberOfDays + totalLastMonthFinalDays
    const monthList = Array.from({length:totalDays});
  
    for(let i = totalLastMonthFinalDays   ; i < totalDays; i++){
      monthList[i] = this.month.getDay(i + 1 - totalLastMonthFinalDays);
    }
  
    console.log("Display Days",Math.ceil(this.month.numberOfDays / 7));
    return monthList;
  }
}

