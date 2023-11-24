import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import linprog

def least_absolute_deviation(x, y):
    x = np.array(x)
    y = np.array(y)

    matF = np.vstack((np.ones_like(x), x))
    m, n = matF.shape

    matA = np.zeros((2* n, m + n))
    matA[:n, :m] =+ matF.T
    matA[n:, :m] =- matF.T
    matA[:n, m:] =- np.eye(n)
    matA[n:, m:] =- np.eye (n)
    vecB = np.zeros(2*n)
    vecB[:n] =+ y
    vecB[n:] =- y

    vecC = np.hstack((np.zeros(m), np.ones(n)))

    result = linprog(vecC, A_ub = matA, b_ub = vecB, bounds = (None, None))
    vecWLAD = result.x[:m]

    if result.success:
        return vecWLAD[0], vecWLAD[1]
    else:
        print('NO SOLUTION FOUND')

# Small example and comparison to least squares.
def linear_function(x, k = 3, m = 1):
    """
    Calculate the linear function y = kx + m.

    Parameters:
    x (list): A list of numerical values.
    k (float): The slope of the linear function.
    m (float): The y-intercept of the linear function.

    Returns:
    list: The y-values of the linear function.
    """

    return [k * i + m for i in x]

x = [1, 2, 3, 4, 5, 6, 7, 8, 9]
y = linear_function(x)

# Add some obvious outliers
y[1] = 2
y[8] = 32

# Calculate the least absolute deviation
m_lad, k_lad = least_absolute_deviation(x, y)

print('k_lad =', k_lad)
print('m_lad =', m_lad)

# Calculate the least squares
k_ls, m_ls = np.polyfit(x, y, 1)

print('k_ls =', k_ls)
print('m_ls =', m_ls)

print('Expected: k = 3, m = 1')

y_lad = linear_function(x, k_lad, m_lad)
y_ls = linear_function(x, k_ls, m_ls)

# Plot the results
plt.scatter(x, y, label = 'Data', color = 'k')
plt.plot(x, y_lad, label = 'LAD', color = 'b')
plt.plot(x, y_ls, label = 'LS', color = 'r')
plt.legend()
plt.show()