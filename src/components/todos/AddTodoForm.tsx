"use client";

import { createTodoAction } from "@/actions/todo.actions";
import {
  DialogClose,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  TodoFormInputValues,
  TodoFormValues,
  todoFormSchema,
} from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ListTodo, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const AddTodoForm = ({ userId }: { userId: string | null }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const defaultValues: Partial<TodoFormInputValues> = {
    title: "",
    body: "",
    completed: false,
  };

  const form = useForm<TodoFormInputValues, unknown, TodoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async ({ title, body, completed }: TodoFormValues) => {
    setLoading(true);
    await createTodoAction({ title, body, completed, userId });
    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="ml-auto h-10 gap-2 rounded-xl bg-violet-700 px-4 font-semibold text-white shadow-sm hover:bg-violet-800 focus-visible:ring-violet-300" />
        }
      >
        <Plus size={16} aria-hidden="true" />
        New Todo
      </DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden rounded-2xl border border-violet-200 bg-violet-100 p-0 text-slate-950 shadow-xl sm:max-w-[480px]">
        <DialogHeader className="border-b border-violet-200 bg-violet-200/70 px-6 py-5 pr-14 sm:px-7 sm:pr-16">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-700 text-white">
              <ListTodo size={19} aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <DialogTitle className="text-lg font-semibold tracking-tight text-slate-950">
                Add a new Todo
              </DialogTitle>
              <DialogDescription className="text-sm leading-5 text-slate-600">
                Give your next task a clear name and a few helpful details.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="px-6 py-6 sm:px-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-semibold text-slate-800">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Plan this week’s workouts"
                        className="h-10 rounded-lg border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus-visible:border-violet-600 focus-visible:ring-violet-600/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-semibold text-slate-800">
                      Short description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add context, a next step, or anything you’ll want to remember."
                        className="min-h-24 resize-y rounded-lg border-slate-300 bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus-visible:border-violet-600 focus-visible:ring-violet-600/20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="flex items-center justify-between gap-3 text-xs text-slate-500">
                      <span>A little context makes the task easier to pick up.</span>
                      <span className="shrink-0 tabular-nums">
                        {field.value?.length ?? 0}/80
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="completed"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50/50 p-4">
                    <div className="pt-0.5">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="size-5 border-violet-400 data-checked:border-violet-700 data-checked:bg-violet-700"
                        />
                      </FormControl>
                    </div>
                    <div className="space-y-1">
                      <FormLabel className="cursor-pointer text-sm font-semibold text-slate-800">
                        Mark as completed
                      </FormLabel>
                      <FormDescription className="text-sm leading-5 text-slate-600">
                        Leave this off to add the task to your to-do list.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="-mx-6 -mb-6 mt-6 flex-col-reverse gap-2 border-t border-violet-200 bg-violet-200/50 px-6 py-4 sm:-mx-7 sm:-mb-6 sm:flex-row sm:justify-end sm:px-7">
                <DialogClose
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 rounded-lg border-slate-300 bg-white px-4 text-slate-700 hover:bg-slate-100"
                    />
                  }
                >
                  Cancel
                </DialogClose>
                <Button
                  type="submit"
                  className="h-10 rounded-lg bg-violet-700 px-5 font-semibold text-white hover:bg-violet-800 focus-visible:ring-violet-300"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner /> Saving
                    </>
                  ) : (
                    "Create Todo"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTodoForm;
