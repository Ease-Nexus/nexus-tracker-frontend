import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Props {
  children?: React.ReactNode;
  body?: React.ReactNode;
  dialog: {
    title: string;
    description?: string;
    actions?: {
      continue: {
        label: string;
        onClick: () => void;
      };
      cancel: {
        label: string;
        onClick?: () => void;
      };
    };
  };
}

export const Dialog = ({
  children,
  body,
  dialog: { title, description, actions },
}: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {body}
        <AlertDialogFooter>
          <AlertDialogAction onClick={actions?.continue.onClick}>
            {actions?.continue.label ?? 'Continue'}
          </AlertDialogAction>
          <AlertDialogCancel onClick={actions?.cancel.onClick}>
            {actions?.cancel.label ?? 'Cancel'}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
