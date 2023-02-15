export interface SimpleFilter {
  field: string;
  caption?: string;
  op:
  | 'contains'
  | 'startWith'
  | 'endWith'
  | '='
  | '>'
  | '<'
  | '>='
  | '<='
  | '!=';
  value?: string | number | null;
}

export interface PaginationData {
  page: number;
  per_page: number;
  pages: number;
  total: number;
  from: number;
  to: number;
  prev_num: number;
  next_num: number;
  sortBy: string;
  descending: boolean;
}

export interface ModalOptions {
  modalOptions?: {
    backdrop?: boolean | 'static';
    keyboard?: boolean;
  };
  closeIcon?: boolean;
  forceHeader?: boolean;
  hideFooter?: boolean;
  title?: string;
  class?: {
    dialog?: string | string[];
    content?: string | string[];
    body?: string | string[];
  };
  style?: {
    dialog?: string | string[];
    content?: string | string[];
    body?: string | string[];
  };
}

export interface SpinnerOptions {
  text?: string;
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  spinner?: {
    color?: string;
    grow?: boolean;
  };
}

export interface CrudDataTableOptions {
  PK?: string;
  size?: 'small' | 'medium' | 'large';
  striped?: boolean;
  max_height?: number | string;
  min_height?: number | string;
  bordered?: boolean;
  single_line?: boolean;
  bottom_bordered?: boolean;
  scroll_x?: number;
  summary_placement?: 'top' | 'bottom';
}

export interface CrudViewOptions {
  title?: string;
  showCloseButton?: boolean;
  confirmDelete?: boolean;
  canDelete?: boolean;
  canEdit?: boolean;
  canAdd?: boolean;
  style?: string;
  size?: 'small' | 'medium' | 'large' | 'huge';
  header_style?: string;
  content_style?: string;
  texts?: {
    confirmDelete?: string;
  };
}
