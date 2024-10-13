from functools import wraps

from django.http import JsonResponse

from logistics_provider_core.models import LogisticAccountUser


def user_passes_test_with_message(test_func, message="You are not an admin."):
    def decorator(view_func):
        def _view_wrapper(request, *args, **kwargs):
            if test_func(request.user):
                return view_func(request, *args, **kwargs)
            return JsonResponse({'error': message}, status=403)
        return wraps(view_func)(_view_wrapper)
    return decorator

