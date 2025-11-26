import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCronSettings,
  updateCronSettings,
  triggerCronNow,
} from '@/lib/api/cron.api';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { useEffect } from 'react';

const cronRegex =
  /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/;

const cronSettingsSchema = z.object({
  cronTime: z.string().regex(cronRegex, 'Invalid cron expression format.'),
  isEnabled: z.boolean(),
});

type CronSettingsFormValues = z.infer<typeof cronSettingsSchema>;

export const CronSettingsManager = () => {
  const queryClient = useQueryClient();

  const { data: cronSettings, isLoading } = useQuery({
    queryKey: ['cron-settings'],
    queryFn: getCronSettings,
  });

  const updateMutation = useMutation({
    mutationFn: updateCronSettings,
    onSuccess: (data) => {
      toast.success(data.message || 'Settings updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['cron-settings'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update settings.');
    },
  });

  const testMutation = useMutation({
    mutationFn: triggerCronNow,
    onSuccess: (data) => {
      toast.success(
        data.message || 'Test notification sent successfully to all users!',
      );
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send test notification.');
    },
  });

  const form = useForm<CronSettingsFormValues>({
    resolver: zodResolver(cronSettingsSchema),
    defaultValues: {
      cronTime: '',
      isEnabled: false,
    },
  });

  useEffect(() => {
    if (cronSettings) {
      form.reset({
        cronTime: cronSettings.cronTime,
        isEnabled: cronSettings.isEnabled,
      });
    }
  }, [cronSettings, form]);

  const onSubmit = (values: CronSettingsFormValues) => {
    updateMutation.mutate(values);
  };

  const handleTestCron = () => {
    testMutation.mutate();
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Promotional Notification Schedule</CardTitle>
        <CardDescription>
          Configure the schedule for the daily promotional push notifications.
          Changes require a service restart to take effect.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='cronTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cron Schedule Expression</FormLabel>
                  <FormControl>
                    <Input placeholder='0 8 * * *' {...field} />
                  </FormControl>
                  <FormDescription>
                    Uses standard cron format. Example: '0 8 * * *' for 8:00 AM
                    daily.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isEnabled'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel>Enable Job</FormLabel>
                    <FormDescription>
                      Enable or disable the promotional notification job.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className='flex space-x-2'>
              <Button type='submit' disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={handleTestCron}
                disabled={testMutation.isPending}
              >
                {testMutation.isPending ? 'Sending...' : 'Test Cron Now'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
