import { Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Slide from './Slide';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const date = new Date();
const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function createMonthSlides() {
  return monthNames.map((name, i) => ({
    id: i.toString(),
    monthName: name,
    month: i,
    days: new Date(date.getFullYear(), i + 1, 0).getDate(),
  }));
}

const monthSlides = createMonthSlides();

export default function MonthCarousel() {
  return (
    <Carousel
      width={screenWidth}
      height={screenHeight}
      data={monthSlides}
      loop
      defaultIndex={new Date().getMonth()}
      pagingEnabled
      snapEnabled
      renderItem={({ item }) => (
        <Slide
          monthName={item.monthName}
          daysInMonth={item.days}
        />
      )}
    />
  );
}
