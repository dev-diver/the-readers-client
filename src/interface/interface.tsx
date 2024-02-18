export interface Book {
  id: number;
  title: string;
  urlName: string;
}

export interface Room {
  id?: number;
  name?: string;
  Books: Book[];
}

export interface CarouselProps {
  numPlanes: number; // 선택적 속성
  radius: number; // 선택적 속성
  books: Book[]; // Book 객체의 배열
  bookClickHandler: (book: Book) => void; // 함수 타입
}