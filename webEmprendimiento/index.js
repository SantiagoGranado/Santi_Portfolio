function handleTickInit(tick) {
    var locale = {
      YEAR_PLURAL: 'Años',
      YEAR_SINGULAR: 'Año',
      MONTH_PLURAL: 'Meses',
      MONTH_SINGULAR: 'Mes',
      WEEK_PLURAL: 'Semanas',
      WEEK_SINGULAR: 'Semana',
      DAY_PLURAL: 'Días',
      DAY_SINGULAR: 'Día',
      HOUR_PLURAL: 'Horas',
      HOUR_SINGULAR: 'Hora',
      MINUTE_PLURAL: 'Minutos',
      MINUTE_SINGULAR: 'Minuto',
      SECOND_PLURAL: 'Segundos',
      SECOND_SINGULAR: 'Segundo',
      MILLISECOND_PLURAL: 'Milisegundos',
      MILLISECOND_SINGULAR: 'Milisegundo'
    };
  
    for (var key in locale) {
      if (!locale.hasOwnProperty(key)) { continue; }
      tick.setConstant(key, locale[key]);
    }
  
    var countdownDate = "2025-02-03T00:00:00+01:00";
    var counter = Tick.count.down(countdownDate);
  
    counter.onupdate = function (value) {
      tick.value = value;
    };
  
    counter.onended = function () {
  
    };
  }