import { getSingleEl, getEventElTimeText } from '../event-render/EventRenderUtils'

describe('moment plugin', function() {
  let toMoment = FullCalendar.Moment.toMoment
  let toDuration = FullCalendar.Moment.toDuration

  describe('toMoment', function() {

    describe('timezone handling', function() {

      it('transfers UTC', function() {
        let calendar = new FullCalendar.Calendar(document.createElement('div'), {
          events: [ { start: '2018-09-05T12:00:00', end: '2018-09-05T18:00:00' } ],
          timeZone: 'UTC'
        })
        let event = calendar.getEvents()[0]
        var startMom = toMoment(event.start, calendar)
        var endMom = toMoment(event.end, calendar)
        expect(startMom.format()).toEqual('2018-09-05T12:00:00Z')
        expect(endMom.format()).toEqual('2018-09-05T18:00:00Z')
      })

      it('transfers local', function() {
        let calendar = new FullCalendar.Calendar(document.createElement('div'), {
          events: [ { start: '2018-09-05T12:00:00', end: '2018-09-05T18:00:00' } ],
          timeZone: 'local'
        })
        let event = calendar.getEvents()[0]
        var startMom = toMoment(event.start, calendar)
        var endMom = toMoment(event.end, calendar)
        expect(startMom.toDate()).toEqualDate('2018-09-05T12:00:00') // compare to local
        expect(endMom.toDate()).toEqualDate('2018-09-05T18:00:00') // compare to local
      })

    })

    it('transfers locale', function() {
      let calendar = new FullCalendar.Calendar(document.createElement('div'), {
        events: [ { start: '2018-09-05T12:00:00', end: '2018-09-05T18:00:00' } ],
        locale: 'es'
      })
      let event = calendar.getEvents()[0]
      var mom = toMoment(event.start, calendar)
      expect(mom.locale()).toEqual('es')
    })

  })

  describe('toDuration', function() {

    it('converts correctly', function() {
      let calendar = new FullCalendar.Calendar(document.createElement('div'), {
        defaultTimedEventDuration: '05:00',
        defaultAllDayEventDuration: { days: 3 }
      })

      // hacky way to have a duration parsed
      let timedDuration = toDuration(calendar.defaultTimedEventDuration)
      let allDayDuration = toDuration(calendar.defaultAllDayEventDuration)

      expect(timedDuration.asHours()).toBe(5)
      expect(allDayDuration.asDays()).toBe(3)
    })

  })

  describe('date formatting', function() {

    it('produces event time text', function() {
      initCalendar({
        defaultView: 'month',
        now: '2018-09-06',
        displayEventEnd: false,
        cmdFormatter: 'moment',
        eventTimeFormat: 'HH:mm:ss[!]',
        events: [
          { title: 'my event', start: '2018-09-06T13:30:20' }
        ]
      })
      expect(getEventElTimeText(getSingleEl())).toBe('13:30:20!')
    })

  })

  describe('range formatting', function() {

    it('renders with same month', function() {
      let calendar = new FullCalendar.Calendar(document.createElement('div'), {
        cmdFormatter: 'moment'
      })
      let s

      s = calendar.formatRange('2018-09-03', '2018-09-05', 'MMMM {D}, YYYY [nice]')
      expect(s).toEqual('September 3 - 5, 2018 nice')

      s = calendar.formatRange('2018-09-03', '2018-09-05', '{D} MMMM, YYYY [nice]')
      expect(s).toEqual('3 - 5 September, 2018 nice')
    })

    it('renders with same year but different month', function() {
      let calendar = new FullCalendar.Calendar(document.createElement('div'), {
        cmdFormatter: 'moment'
      })
      let s

      s = calendar.formatRange('2018-09-03', '2018-10-05', '{MMMM {D}}, YYYY [nice]')
      expect(s).toEqual('September 3 - October 5, 2018 nice')

      s = calendar.formatRange('2018-09-03', '2018-10-05', '{{D} MMMM}, YYYY [nice]')
      expect(s).toEqual('3 September - 5 October, 2018 nice')
    })

    it('renders with different years', function() {
      let calendar = new FullCalendar.Calendar(document.createElement('div'), {
        cmdFormatter: 'moment'
      })
      let s

      s = calendar.formatRange('2018-09-03', '2019-10-05', '{MMMM {D}}, YYYY [nice]')
      expect(s).toEqual('September 3, 2018 nice - October 5, 2019 nice')

      s = calendar.formatRange('2018-09-03', '2019-10-05', '{{D} MMMM}, YYYY [nice]')
      expect(s).toEqual('3 September, 2018 nice - 5 October, 2019 nice')
    })

    it('inherits defaultRangeSeparator', function() {
      let calendar = new FullCalendar.Calendar(document.createElement('div'), {
        cmdFormatter: 'moment',
        defaultRangeSeparator: ' to '
      })
      let s = calendar.formatRange('2018-09-03', '2018-09-05', 'MMMM D, YYYY [nice]')
      expect(s).toEqual('September 3, 2018 nice to September 5, 2018 nice')
    })

    it('produces title with titleRangeSeparator', function() {
      initCalendar({ // need to render the calendar to get view.title :(
        defaultView: 'basicWeek',
        now: '2018-09-06',
        cmdFormatter: 'moment',
        titleFormat: 'MMMM {D} YY [yup]',
        titleRangeSeparator: ' to '
      })
      expect(currentCalendar.view.title).toBe('September 2 to 8 18 yup')
    })

  })

})